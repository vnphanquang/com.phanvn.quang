'use strict';
//ENVIROMENT_VARIABLES
require('dotenv').config()

//file system API
const fs = require('fs');

//express & static directory
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//express subdomain
// const subdomain = require('express-subdomain');
// app.use(subdomain('quang', express.static('quang/public')));

//parsing application/x-www-form-urlencoded
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Parsing multipart/form-data
const multer = require('multer');
const upload = multer();

//NodeMailer
const nodemailer = require('nodemailer');

//---------------------- Quang Subdomain ----------------------
//Index Request GET
app.get('/quang', (req, res) => {
   res.render('index');
});

app.get('*', (req, res) => {
   res.redirect('/quang');
});

//Contact Request POST
app.post('/quang/contact', upload.none(), (req, res) => {

   let mailOpts, smtpTrans;
   smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, //use SSL
      auth: {
         user: process.env.GMAIL_USER,
         pass: process.env.GMAIL_PASS
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
            }
            else {
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


//---------------------- Server Initiation ----------------------
// const hostname = '127.0.0.1';
const PORT = process.env.PORT || 5000;

//localhost server
app.listen(PORT, () => {
console.log(`Express server running at port: ${PORT} ...`);
});
