'use strict';
//ENVIROMENT_VARIABLES
require('dotenv').config()

//file system API
const fs = require('fs');

//express & static directory
const express = require('express');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

//parsing application/x-www-form-urlencoded
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Parsing multipart/form-data
const multer = require('multer');
const upload = multer();

//NodeMailer
const nodemailer = require('nodemailer');

//---------------------- Routing ----------------------
app.get('/quang/*', (req, res) => {
   res.redirect('/quang');
});

app.get('/quang', (req, res) => {
   res.render('index');
});

app.post('/contact', upload.none(), (req, res) => {

   let mailOpts, smtpTrans;
   smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, //use SSL
      secure: true,
      auth: {
         user: process.env.GMAIL_USER,
         pass: process.env.GMAIL_PASS
      }
   });

   let name = req.body.name;
   name = (name == '') ? 'Unspecified Name' : name;
   let email = req.body.email;
   email = (email == '') ? 'Unspecified Email' : email;
   let message = req.body.message;
   mailOpts = {
      from: `${name} <${email}`,
      to: process.env.GMAIL_USER,
      subject: 'New message from contact form at vnphanquang',
      text: `${name} (${email}) says: ${message}`
   };
   
   smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
         let date = new Date();
         let toFileStr = `${date}\n${name} (${email}) says: ${message}\n${error}\n
         ----------------------------------------------------\n`;
         fs.appendFile('contact-failure-log.txt', toFileStr, (error) => {
            if (error) console.log("Failed to update contact-failure-log.txt");
            else console.log(`Contact form request: failure at ${date}\nUpdated contact-failure-log.txt`);
         });
         res.status(200).send();
      } else {
         console.log(`\nContact form request: success at ${new Date()}\n`);
         res.status(200).send();
      }
   });

});
app.get(['/favicon.ico', '/quang/favicon.ico'], (req, res) => {});

app.get('*', (req, res) => {
   console.log(`Unhandled Request from ${req.originalUrl}`);
   res.send(); 
});

//---------------------- Server Initiation ----------------------
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

// local host server
app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/ ...`);
});