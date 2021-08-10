import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();



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

    /**
     * Saves the key and value in the redis DB
     */
    set(key, value){
        value = JSON.stringify(value);
        this.client.set(key, value, (err, reply) => {
            if (err){
                console.log("error to set the key - value");
            } else {
                console.log("key set!");
            }
        });
    }

    /**
     * Returns the value stored in this key
     */
    get(key){ 
        return new Promise((resv, rej) => {
            this.client.get(key, (err, reply) => {
                if (err){
                    rej(err);
                } else {
                    reply = JSON.parse(reply);
                    resv(reply);
                }
            });
        });

        // return this.client.get(key, (err, reply) => {
        //     if (err){
        //         return false;
        //     } else {
        //         reply = JSON.parse(reply);
        //         return reply;
        //     }
        // });
    }

    /**
     * Deletes the key from the redis db
     */
    delete(key){
        this.client.del(key, function(err, response) {
            if (response == 1) {
               console.log("Deleted Successfully!");
            } else{
             console.log("Cannot delete");
            }
         })
    }


}

export default RedisHelper;
