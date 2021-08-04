import redis from 'redis';
var subscriber = redis.createClient();
import elasticsearch from 'elasticsearch';
import CommunicationHelper from './helpers/CommunicationHelper.js';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
const communicationHelper = new CommunicationHelper();

const client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '6.8'
  })
  
  // request with the token to get the account id
  
  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

subscriber.on("message", function (channel, events) {
    if(channel == 'events'){
        events = JSON.parse(events);
        const data = [];
        events.forEach(event => {
            data.push({index: {_index: 'test', _type: 'external'}});
            data.push(event);
        });
        client.bulk({
            body: data
        })
    }
});

subscriber.subscribe('events');

subscriber.on("message", async function (channel, mailsData) {
    if(channel === 'sendMails'){
        mailsData = JSON.parse(mailsData);
        console.log('got mail list', mailsData.usersList);
        //  TODO add loop to send mail

        try {
            data = await communicationHelper.sendMail(
                'coheen1@gmail.com', 
                // TODO userMail
                'coheen1@gmail.com', 
                mailsData.subject, 
                `<p style='white-space: pre-wrap'>${mailsData.content}</p>`
            );
            console.log("the data is: ", data);
        } catch (error) {
            console.log('error');
        }
        
    }
});

subscriber.subscribe('sendMails');

subscriber.on("message", async function (channel, smsData) {
    if(channel === 'sendSMS'){
        smsData = JSON.parse(smsData);
        console.log('got phones list', smsData.usersList);
        //  TODO add loop to send mail
        const result = await communicationHelper.sendSMS(smsData.content, '+972525369797');
        if(result){
            // socket - > sent!
        }
        
    }
});

subscriber.subscribe('sendSMS');