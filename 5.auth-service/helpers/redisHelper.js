import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
import redis from 'redis';



class RedisHelper {

constructor(){
    this.client = redis.createClient({
        host: process.env.HOST,
        port: 6379,
    });

    this.client.on('error', err => {
        console.log('Error ' + err);
    });
}

set(key, value){
    value = JSON.stringify(value);
    this.client.set(key, value, (err, reply) => {
        if (err){
            console.log("error to set to redis");
            console.log(err);
        } else {
            console.log("key set!");
        }
    });
}

get(key){ 
    return this.client.get(key, (err, reply) => {
        if (err){
            return false;
        } else {
            reply = JSON.parse(reply);
            console.log("get key - ", reply);
            return reply;
        }
    });
}



}

export default RedisHelper;
