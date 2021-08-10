import MailGun from 'mailgun-js';
import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';

class CommunicationHelper {

    async sendMail(from, to, subject, html){
        const mailGun = new MailGun({
          apiKey: process.env.API_KEY,
          domain: process.env.DOMAIN,
        });
        var data = {
          from: from,
          to: to,
          subject: subject,
          html: html,
        };
        // Sending the data to the specify mail
        
        return new Promise((resolve, reject)=>{
          mailGun.messages().send(data, function (err, body) {
            if (err) {
              reject('failed to send email');
            } else {
              console.log('everything is good');
              resolve(true)
            }
          });
        });
      }


      async sendSMS(content, to){
          const accountSid = process.env.ACCOUNT_SID;
          const authToken = process.env.ACCOUNT_TOKEN; 
          const client = new twilio(accountSid, authToken);
          console.log('in send sms');
          return await client.messages
            .create({
              body: content,
              to: to, 
              from: '+17402004750', 
            });
          
      }

}

export default CommunicationHelper;