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
  console.log("Server Started :: Home");
});
app.get('/service', (req, res) => {
  res.render('services');
  console.log("Server Started :: Services");
});
app.get('/contact', (req, res) => {
  res.render('contact');
  console.log("Server Started :: Contact");
});

// Mail Body
app.post('/send', (req, res) => {
  const output = `
  <!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8"> <!-- utf-8 works for most cases -->
      <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
      <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
      <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
  
      <!-- Web Font / @font-face : BEGIN -->
      <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->
  
      <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
      <!--[if mso]>
          <style>
              * {
                  font-family: sans-serif !important;
              }
          </style>
      <![endif]-->
  
      <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
      <!--[if !mso]><!-->
      <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
      <!--<![endif]-->
  
      <!-- Web Font / @font-face : END -->
  
      <!-- CSS Reset : BEGIN -->
      <style>
  
          /* What it does: Remove spaces around the email design added by some email clients. */
          /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
          html,
          body {
              margin: 0 auto !important;
              padding: 0 !important;
              height: 100% !important;
              width: 100% !important;
          }
  
          /* What it does: Stops email clients resizing small text. */
          * {
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
          }
  
          /* What it does: Centers email on Android 4.4 */
          div[style*="margin: 16px 0"] {
              margin: 0 !important;
          }
  
          /* What it does: Stops Outlook from adding extra spacing to tables. */
          table,
          td {
              mso-table-lspace: 0pt !important;
              mso-table-rspace: 0pt !important;
          }
  
          /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
          table {
              border-spacing: 0 !important;
              border-collapse: collapse !important;
              table-layout: fixed !important;
              margin: 0 auto !important;
          }
          table table table {
              table-layout: auto;
          }
  
          /* What it does: Uses a better rendering method when resizing images in IE. */
          img {
              -ms-interpolation-mode:bicubic;
          }
  
          /* What it does: A work-around for email clients meddling in triggered links. */
          *[x-apple-data-detectors],  /* iOS */
          .unstyle-auto-detected-links *,
          .aBn {
              border-bottom: 0 !important;
              cursor: default !important;
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
          }
  
          /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
          .a6S {
              display: none !important;
              opacity: 0.01 !important;
          }
          /* If the above doesn't work, add a .g-img class to any image in question. */
          img.g-img + div {
              display: none !important;
          }
  
          /* What it does: Prevents underlining the button text in Windows 10 */
          .button-link {
              text-decoration: none !important;
          }
  
          /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
          /* Create one of these media queries for each additional viewport size you'd like to fix */
  
          /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
          @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
              .email-container {
                  min-width: 320px !important;
              }
          }
          /* iPhone 6, 6S, 7, 8, and X */
          @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
              .email-container {
                  min-width: 375px !important;
              }
          }
          /* iPhone 6+, 7+, and 8+ */
          @media only screen and (min-device-width: 414px) {
              .email-container {
                  min-width: 414px !important;
              }
          }
  
      </style>
      <!-- CSS Reset : END -->
    <!-- Reset list spacing because Outlook ignores much of our inline CSS. -->
    <!--[if mso]>
    <style type="text/css">
      ul,
      ol {
        margin: 0 !important;
      }
      li {
        margin-left: 30px !important;
      }
      li.list-item-first {
        margin-top: 0 !important;
      }
      li.list-item-last {
        margin-bottom: 10px !important;
      }
    </style>
    <![endif]-->
  
      <!-- Progressive Enhancements : BEGIN -->
      <style>
  
        /* What it does: Hover styles for buttons */
        .button-td,
        .button-a {
            transition: all 100ms ease-in;
        }
        .button-td-primary:hover,
        .button-a-primary:hover {
            background: #555555 !important;
            border-color: #555555 !important;
        }
  
        /* Media Queries */
        @media screen and (max-width: 600px) {
  
            /* What it does: Adjust typography on small screens to improve readability */
            .email-container p {
                font-size: 17px !important;
            }
  
        }
  
      </style>
      <!-- Progressive Enhancements : END -->
  
      <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
      <!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
  
  </head>
  <!--
    The email background color (#222222) is defined in three places:
    1. body tag: for most email clients
    2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
    3. mso conditional: For Windows 10 Mail
  -->
  <body width="100%" style="margin: 0; mso-line-height-rule: exactly; background-color: #222222;">
      <center style="width: 100%; background-color: #ffffff; text-align: left;">
      <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #222222;">
      <tr>
      <td>
      <![endif]-->
  
          <!-- Visually Hidden Preheader Text : BEGIN -->
          <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
              (Optional) This text will appear in the inbox preview, but not the email body. It can be used to supplement the email subject line or even summarize the email's contents. Extended text preheaders (~490 characters) seems like a better UX for anyone using a screenreader or voice-command apps like Siri to dictate the contents of an email. If this text is not included, email clients will automatically populate it using the text (including image alt text) at the start of the email's body.
          </div>
          <!-- Visually Hidden Preheader Text : END -->
  
          <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
          <!-- Preview Text Spacing Hack : BEGIN -->
          <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <!-- Preview Text Spacing Hack : END -->
  
          <!--
              Set the email width. Defined in two places:
              1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
              2. MSO tags for Desktop Windows Outlook enforce a 600px width.
          -->
          <div style="max-width: 600px; margin: 0 auto;" class="email-container">
              <!--[if mso]>
              <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
              <tr>
              <td>
              <![endif]-->
  
            <!-- Email Body : BEGIN -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto;">
              <!-- Email Header : BEGIN -->
                <tr>
                    <td style="padding: 20px 0; text-align: center">
                        <img src="http://www.letsupgrade.tech/img/big-logo.png" width="200" height="50" alt="alt_text" border="0" style="height: auto;  font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555;">
                    </td>
                </tr>
              <!-- Email Header : END -->
  
                  <!-- Hero Image, Flush : BEGIN -->
     <!--              <tr>
                      <td >
                          <img src="http://www.letsupgrade.tech/img/big-logo.png" width="600" height="" alt="alt_text" border="0" style="width: 100%; max-width: 600px; height: auto; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555; margin: auto;" class="g-img">
                      </td>
                  </tr> -->
                  <!-- Hero Image, Flush : END -->
  
                  <!-- 1 Column Text + Button : BEGIN -->
                  <tr>
                      <td style="background-color: #ffffff;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                  <td style="padding: 0 20px;">
                                      <!-- Button : BEGIN -->
                                      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
  
                                      </table>
                                      <!-- Button : END -->
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
                                      <h2 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 18px; line-height: 22px; color: #333333; font-weight: bold;">New Registration !!!</h2>
                                      <ul style="padding: 0; margin: 0 0 10px 0; list-style-type: disc;">
                      <li style="margin:0 0 10px 30px;" class="list-item-first"><strong>Name :</strong>  ${req.body.name}</li>
                      <li style="margin:0 0 10px 30px;"><strong>Email :</strong>  ${req.body.email}</li>
                                          <li style="margin: 0 0 0 30px;" class="list-item-last"><strong>Mobile No :</strong>  ${req.body.subject}</li>
                                          <li style="margin: 0 0 0 30px;" class="list-item-last"><strong>Intrest :</strong>  ${req.body.chk}</li>
                    </ul>
                                    
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- 1 Column Text + Button : END -->
  
                  <!-- 2 Even Columns : BEGIN -->
                  
                  <!-- Two Even Columns : END -->
  
                  <!-- Clear Spacer : BEGIN -->
                  <tr>
                      <td aria-hidden="true" height="40" style="font-size: 0px; line-height: 0px;">
                          &nbsp;
                      </td>
                  </tr>
                  <!-- Clear Spacer : END -->
  
                  <!-- 1 Column Text : BEGIN -->
  <!--                 <tr>
                      <td style="background-color: #ffffff;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                  <td style="padding: 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
                                      <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr> -->
                  <!-- 1 Column Text : END -->
  
              </table>
              <!-- Email Body : END -->
  
              <!-- Email Footer : BEGIN -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px;">
                  <tr>
                      <td style="padding: 20px; font-family: sans-serif; font-size: 12px; line-height: 15px; text-align: center; color: #888888;">
                        <!--   <webversion style="color: #cccccc; text-decoration: underline; font-weight: bold;">View as a Web Page</webversion> -->
   
                         <!--  <unsubscribe style="color: #888888; text-decoration: underline;">unsubscribe</unsubscribe> -->
                      </td>
                  </tr>
              </table>
              <!-- Email Footer : END -->
  
              <!--[if mso]>
              </td>
              </tr>
              </table>
              <![endif]-->
          </div>
  
          <!-- Full Bleed Background Section : BEGIN -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fcb900;">
              <tr>
                  <td valign="top">
                      <div style="max-width: 600px; margin: auto;" class="email-container">
                          <!--[if mso]>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                          <tr>
                          <td>
                          <![endif]-->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                  <td style="padding: 20px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #000000;">
                                      <br><br><center> <strong>
                                      New Wave IT Labs - ITM<br><span class="unstyle-auto-detected-links">ITM BUSINESS SCHOOL, <br> SIPCOT IT PARK,<br>Chennai<br>contact@letsupgrade.tech</span>
                                  </strong>    </center>  <br><br>
                                  </td>
                              </tr>
                          </table>
                        
                          <!--[if mso]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                      </div>
                  </td>
              </tr>
          </table>
          <!-- Full Bleed Background Section : END -->
  
      <!--[if mso | IE]>
      </td>
      </tr>
      </table>
      <![endif]-->
      </center>
    
  </body>
  </html>
   
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
      html: output // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions,(error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('home', {msg:'Email has been sent'});
  });

  });

//app.listen(3000, () => console.log('Server started...'));