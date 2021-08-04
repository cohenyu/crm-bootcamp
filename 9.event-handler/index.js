import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import redis from 'redis';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var publisher = redis.createClient();

const __dirname = dirname(fileURLToPath(import.meta.url));


app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});


app.get('/',(req, res) => {
    res.sendFile(__dirname + '/handlers.js');
  });

app.post('/saveEvents',(req, res) => {

  publisher.publish('events', JSON.stringify(req.body.events), function () {
    console.log('success');
  });
  res.send(true);

});

