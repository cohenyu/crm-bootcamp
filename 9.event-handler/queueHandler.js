import redis from 'redis';
var subscriber = redis.createClient();
import elasticsearch from 'elasticsearch';
import CommunicationHelper from './helpers/CommunicationHelper.js';
import dotenv from 'dotenv';
dotenv.config();
const communicationHelper = new CommunicationHelper();

import { Server } from 'socket.io';
import redisAdapter from 'socket.io-redis';

const io = new Server(2200, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:8003',
        'http://homemade.delivery.com:8003',
      ],
    },
  });
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '6.8'
  })


/**
 * Inserts the events to the elastic DB
 */
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


/**
 * Sends an email to every email from the list
 */
subscriber.on("message", async function (channel, mailsData) {
    if(channel === 'sendMails'){
        mailsData = JSON.parse(mailsData);
        for(let mail of mailsData.usersList){
            try {
                data = await communicationHelper.sendMail(
                    'coheen1@gmail.com', 
                    // TODO userMail
                    'coheen1@gmail.com', 
                    mailsData.subject, 
                    `<p style='white-space: pre-wrap'>${mailsData.content}</p>`
                );
            } catch (error) {
                console.log('error');
            }
            io.emit('sent', mail);
        }
        
    }
});

subscriber.subscribe('sendMails');


/**
 * Sends a sms to every phone number from the list
 */
subscriber.on("message", async function (channel, smsData) {
    if(channel === 'sendSMS'){
        smsData = JSON.parse(smsData);
        for(let phone of smsData.usersList){
            const result = await communicationHelper.sendSMS(smsData.content, '+972525369797');
            // const result = await communicationHelper.sendSMS(smsData.content, phone);
            if(result){
                io.emit('sent', phone);
            }
        }
    }
});

subscriber.subscribe('sendSMS');

