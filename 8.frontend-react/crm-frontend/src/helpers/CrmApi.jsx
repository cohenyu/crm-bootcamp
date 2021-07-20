import axios from 'axios';

class CrmApi {

    constructor(){
        this.basicUrl = 'http://localhost:9991';
    }

    async saveImg(data){
        
        const response = await axios.post(`${this.basicUrl}/imgs/saveImg/`, data);

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }


    async postRequest(url, data={}){
        const response = await axios.post(`${this.basicUrl}${url}`, {data: data, token: localStorage.getItem('jwtToken')}).catch((e)=>{console.log("error: ", e)});

        if(response) {
            return response.data;
        }
        else {
            return false;
        }
    }

}

export default CrmApi;