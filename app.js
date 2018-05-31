const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
var port = process.env.PORT || 3000;
const nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var cons = require('consolidate');


const app = express();
app.listen(process.env.PORT || 3000 );
// View engine setup
/* app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars'); */
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('html', cons.swig)
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Static folder
//app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('home');
  console.log("Server Started");
});

app.post('/send', (req, res) => {
  const output = `
    <p>#LetsUpgrade Chennai</p>
    <h3>New Entry</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.subject}</li>
      <li> Message : ${req.body.message}</li>
    </ul>
   
  `;

  // create reusable transporter object using the default SMTP transport
  
  let transporter = nodemailer.createTransport({
    service: 'SendGrid',
   // host: 'smtp.sendgrid.net',
   // port:  465,
   // secure: false, // true for 465, false for other ports
   auth: {
    user: 'Viralpatel380', // generated ethereal user
    pass: 'viralpatel380'  // generated ethereal password
}
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"#LetsUpgrade, India" <contact@upgrde.tech>', // sender address
      to: 's.viralbp@itmvu.in, saikirans@itm.edu', // list of receivers
      subject: '#LetsUpgrade | New Entry', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions,(error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });

  });

//app.listen(3000, () => console.log('Server started...'));