'use strict';
//ENVIROMENT_VARIABLES
require('dotenv').config()

//Dependencies 
const express = require('express');
const path = require('path');
var vhost = require('vhost');
//file system API
const fs = require('fs');
//parsing application/x-www-form-urlencoded
const bodyParser = require('body-parser');
//Parsing multipart/form-data
const multer = require('multer');
const upload = multer()
//NodeMailer
const nodemailer = require('nodemailer');

// Main server app
var mainapp = express();
mainapp.use(express.static(path.join(__dirname, 'public')));
mainapp.set('view engine', 'ejs');

mainapp.get('/:sub', function (req, res) {
  //  res.send('requested ' + req.params.sub);
  switch (req.params.sub) {
    case 'quang':
      res.status(302).redirect('/quang/index.html.var');
      break;
    case 'nhat':
      res.send('requested ' + req.params.sub);
      break;
    default:
      res.status(404).send();
      break;
  }

});

mainapp.get('/', function (req, res) {
  res.status(302).redirect('/quang/index.html.var')
});

mainapp.get('/quang/index.html.var', (req, res) => {
  res.render('index');
});

//Contact Request POST
mainapp.post('/quang/contact', upload.none(), (req, res) => {

  // console.log("Message Sent");
  // res.status(200).send();
  // return;

  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'a2plcpnl0387.prod.iad2.secureserver.net',
    port: 465,
    secure: true, //use SSL
    auth: {
      user: process.env.DOMAIN_EMAIL,
      pass: process.env.DOMAIN_EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  let name = req.body.name;
  name = (name === '') ? '<Unspecified Name>' : name;
  let email = req.body.email;
  email = (email === '') ? '<Unspecified Email>' : email;
  let message = req.body.message;
  mailOpts = {
    from: `Nodemailer Server <${process.env.DOMAIN_EMAIL}>`,
    to: process.env.GMAIL_USER,
    subject: 'New Contact Request',
    text: `${name} (${email}) says: ${message}`
  };

  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      console.log(error);
      let date = new Date();
      let toFileStr = `${date}\n${name} (${email}) says: ${message}\n${error}\n
        ----------------------------------------------------\n`;
      fs.appendFile('contact-failure-log.txt', toFileStr, (error) => {
        if (error) {
          console.log("Failed to update contact-failure-log.txt");
        } else {
          console.log(`Contact form request: failure at ${date}\nUpdated contact-failure-log.txt`);
        }
      });
      res.status(200).send();
    } else {
      console.log(`\nContact form request: success at ${new Date()}\n`);
      res.status(200).send();
    }
  });

});

// Subdomain apps

var subapp = express();

subapp.use((req, res) => {
  res.redirect('http://phanvn.com:3000/' + req.vhost[0]);
});

// Vhost app
var app = module.exports = express();

// add vhost routing for main app
app.use(vhost('phanvn.com', mainapp)); // Serves top level domain via Main server app
app.use(vhost('www.phanvn.com', mainapp)); // Serves top level domain via Main server app

// listen on all subdomains sub apps
app.use(vhost('*.phanvn.com', subapp)); // Serves all subdomains via Redirect app

//---------------------- Server Initiation ----------------------
const hostname = '127.0.0.1';
const port = 3000;

// localhost server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ ...`);
});