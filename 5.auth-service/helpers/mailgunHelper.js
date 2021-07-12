import MailGun from 'mailgun-js';
import dotenv from 'dotenv';
dotenv.config();

class MailgunHelper {

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
              resolve({valid: true})
            }
          });
        });
      }

}

export default MailgunHelper;