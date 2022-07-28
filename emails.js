const nodemailer = require('nodemailer');
      let transporter = nodemailer.createTransport({
             host: 'smtp.gmail.com',
             port: 587,
             auth: {
                 user: "profi.ua1991@gmail.com",
                 pass: "ercswcoljoaabxek"
             }
     })
let message = {
         from: "Максимильян",
         to: "brikodili.troyan@gmail.com",
         subject: "Subject",
         text: "Hello SMTP Email"
    }
    transporter.sendMail(message, function(err, info) {
         if (err) {
           console.log(err)
         } else {
           console.log(info);
         }
    });