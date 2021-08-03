import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import elasticsearch from 'elasticsearch';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = dirname(fileURLToPath(import.meta.url));
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

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});



app.get('/',(req, res) => {
    res.sendFile(__dirname + '/handlers.js');
  })

  app.post('/saveEvents',(req, res) => {
    console.log("events: ", req.body.events);
    const data = [];
    req.body.events.forEach(event => {
      data.push({index: {_index: 'test', _type: 'external'}});
      data.push(event);
    });
    client.bulk({
      body: data
    })
    //   client.index({
    //     index: 'products',
    //     type: 'external',
    //     body: {
    //         'Name': 'ilana cohen',
    //     }
    // })
    // .then(response => {
    //   console.log("Indexing successful");
    // })
    // .catch(err => {
    //   console.log('error');
         
    // })
    res.send(req.body);
  })

