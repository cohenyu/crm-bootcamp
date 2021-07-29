const axios = require('axios');

class MongoHelper {
    constructor(){
        this.basicUrl = 'http://localhost:9034/chat';
    }

    async getRequest(url) {
        console.log("the url is: ", url);
        try {
            var response = await axios.get(`${this.basicUrl}${url}`);
        } catch (error) {
            console.log("error to post request with: ", url);
            return null;
        }
        
        if(response){
            return response.data;
        }
        return null;
    }

    async postRequest(url, data) {
        try{
            var response = await axios.post(`${this.basicUrl}${url}`, data);
        } catch (error){
            console.log("error to post request with: ", url, data);
            return null;
        }
        
        if(response){
            return response.data;
        }
        return null;
    }

    async putRequest(url, data) {
        try{
            var response = await axios.put(`${this.basicUrl}${url}`, data);
        } catch (error) {
            console.log("error to post request with: ", url, data);
            return null;
        }
        
        
        if(response){
            return response.data;
        }
        return null;
    }
}

module.exports = MongoHelper;
