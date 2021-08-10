const axios = require('axios');

class MongoHelper {
    constructor(){
        this.basicUrl = 'http://localhost:9034/chat';
    }

    async getRequest(url) {
        try {
            var response = await axios.get(`${this.basicUrl}${url}`);
        } catch (error) {
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
            return null;
        }
        
        
        if(response){
            return response.data;
        }
        return null;
    }
}

module.exports = MongoHelper;
