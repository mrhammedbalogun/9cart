const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const apiConfig = process.env.apiConfig;
const mailgunConfig = process.env.mailgunConfig;


export default async (req, res) => {
  if (req.method === 'POST') {
    const { ticketNo = '', password = '', name = '' } = req.body;

    let message, status

    // Validating the request body
    if (ticketNo.length === 0 || password.length === 0) {
      res.statusCode = 400;
      res.json({ message: 'Ticket Number or password cannot be empty' });
      return;
    }

    // make a call to the file endpoint to get base
    let apiResponse;
    try {
      apiResponse = await fetch(
        'https://mybankstatement.net/TP/api/ConfirmStatement',
        {
          method: 'POST',
          body: JSON.stringify({ ticketNo, password }),
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Client-ID': apiConfig['Client-ID'],
            'Client-Secret': apiConfig['Client-Secret'],
          },
        }
      );

     
       res.statusCode =  status = apiResponse.status
      apiResponse = await apiResponse.json();

      if (res.statusCode === 200 && apiResponse.status == '00') {
        apiResponse = await fetch(
          'https://mybankstatement.net/TP/api/GetPDFStatement',
          {
            method: 'POST',
            body: JSON.stringify({ ticketNo, password }),
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
              Accept: '*/*',
              'Client-ID': apiConfig['Client-ID'],
              'Client-Secret': apiConfig['Client-Secret'],
            },
          }
        );


        // console.log('PDF GENERATE', apiResponse.status  , apiResponse)

        res.statusCode = status = apiResponse.status;
        apiResponse = await apiResponse.json();
        
        if (apiResponse.status !== '00') {
          throw new Error(apiResponse.message);
        }

        //   const filePath = path.join(__dirname, 'statements', `${password}.pdf`);
        //  Generate file on server and also send email
        //   fs.writeFile(
        //     `${password}.pdf`,
        //     apiResponse.result,
        //     { encoding: 'base64' },
        //     function (err) {
        //       if (err) {
        //         throw new Error('Statement could not be generated');
        //       }
        //       console.log('Statement Generated');
        //     }
        //   );

        // Auth config
        const auth = {
          auth: {
            api_key: mailgunConfig.api_key,
            domain: mailgunConfig.domain,
          },
        };

        //   create a nodemailer transport
        const transporter = nodemailer.createTransport(mailgun(auth));

        //  setup mail options
        const username = name.length > 0 ? name.toUpperCase() : 'User';
        const mailOptions = {
          from: 'tech@9cart.com.ng',
          to: '9cartstatement@gmail.com', //'mrhammedbalogun@gmail.com',
          subject: `Statement of account for ${username}`,
          html: `<b>Hello Admin,</b> <br /> <p>Find attached to this email the statement of account for ${username} with document id:${password}</p> <br/>
                <p>To open the file please use <b>${password}</b> as the password </p>
                <p>Regards!</p>`,
          attachments: [
            {
              filename: `${password}.pdf`,
              content: Buffer.from(apiResponse.result, 'base64'),
              contentType: 'application/pdf',
            },
          ],
        };

        const info = await transporter.sendMail(mailOptions);
        if (!info) {
          res.statusCode = status = 500
          throw new Error('Could not send mail');
        }
        console.log('mail sent!');
      } else {

        res.statusCode = status
        console.log(apiResponse)
        throw new Error(apiResponse.messagee);
      }
    } catch (error) {
      console.log(error.message);
      // res.statusCode = 500;
      return res.send({
        message: error.message,  //'There is a problem with the server please try again'
        status,
      });
    }

    res.statusCode = 200;
    res.json({ status: 200 });
  }
};
