'use strict';

const process = require('process'); // Required to mock environment variables

// [START gae_storage_app]
const {format} = require('util');
const express = require('express');
//const Multer = require('multer');
const bodyParser = require('body-parser');
// käytä nodemaileria
const nodemailer = require('nodemailer');
//const SHA224 = require("sha224");
//const uuid = require('uuid'); //oli ('uuid/v1')
// 
const {Storage} = require('@google-cloud/storage');
//var SERVER_name = 'https://storage.googleapis.com';
//var BUCKET_name = 'https://storage.cloud.google.com/kumula.appspot.com'

// Instantiate a storage client
const storage = new Storage();

const app = express();
//app.set('view engine', 'pug');
//app.engine('html', require('ejs').renderFile); ONgelmia
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // OMA

//--- cors OMA 9.1.2025
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})
const cors = require("cors");
app.use(cors());
//----cors end

// Multer is required to process file uploads and make them available via
// req.files.
/*
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});
*/
// A bucket is a container for objects (files).
//const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

app.get('/', (req, res) => {
 
    var fs = require('fs');
    fs.readFile("./views/index.html",null, function (error, data) {
      if (error) {
          res.writeHead(404);
          res.write('Contents you are looking are Not Found');
          res.end();
      } else {
          res.writeHead(200, { 'Content-Type': 'text/html'});   
          res.write(data);            
          res.end();       
      }             
  });
  });
//*************************************

//https://expressjs.com/en/advanced/developing-template-engines.html

//kun asiakas lähettää viestin www-sivuilta | https://profolio2.appspot.com/contact -> tulee sähköposti

app.get('/contact', (req, res) => {
  
  console.log('Kontak')
 });
 
 // kokeile nodemailer: alla ohjeet
 // https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
 // https://mailtrap.io/blog/nodemailer-gmail/
 // https://erikmartinjordan.com/use-nodemailer-gmail-alias-accoun
 // https://www.youtube.com/watch?v=nF9g1825mwk&t=560s
 //main.handlebars (yhteydenotto) form submit button lähettää post action=send - näkyy tapahtuman jälkeen url:ssä https://epox.kuva.site/send
 
 app.post('/send',(req,res)=>{
   console.log(req.body)
   const output = `
     <p>You have a new contact request</p>
     <h3>Contact Details</h3>
     <ul>  
       <li>Name: ${req.body.name}</li>
       <li>Company: ${req.body.company}</li>
       <li>Email: ${req.body.email}</li>
       <li>Webpage: ${req.body.web}</li>
     </ul>
     <h3>Message</h3>
     <p>${req.body.message}</p>
   `;
 
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
     //host: 'mail.kuva.site',
     //port: 587,
     //secure: false, // true for 465, false for other ports
     // alla - service: 'gmail' on vaihtoehto ylläoleville host, port ... nähtävästi?
     service: 'gmail', 
     auth: {
         user: 'epoxsale@gmail.com', // generated ethereal user
         pass: 'vnpq htxj xpui lrik'  // roope 'odhw jxom weas wnby' | jv 'nauf jarx edcx gqsh'| epoxsale 'vnpq htxj xpui lrik'
     },
     tls:{
       rejectUnauthorized:false
     }
   });
 
   // setup email data with unicode symbols
   let mailOptions = {
       from: '"Nodemailer Contact via EpoXsale" <your@email.com>', // sender address
       to: 'epoxsale@gmail.com', // list of receivers
       subject: 'Contact Request via EpoXsale', // Subject line
       text: req.body.message, // plain text body
       html: output // html body
   };
 
   // send mail with defined transport object
   transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
           return console.log(error);
       }
       console.log('Message sent: %s', info.messageId);   
       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
 
       res.render('contact', {msg:'Email has been sent'});
   });
 })
//**********
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_storage_app]

//export GCLOUD_STORAGE_BUCKET=kumula.appspot.com
//export GOOGLE_CLOUD_PROJECT=kumula
// npm install
// npm start

// kun tallennat pilveen
// export PATH="/home/jariv/google-cloud-sdk/bin:$PATH"
// gcloud app deploy --project kumula --version 1
module.exports = app;
