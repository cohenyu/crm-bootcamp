import axios from 'axios';


class CrmApi {

    constructor(){
        this.basicUrl = 'http://localhost:9991';
        axios.interceptors.response.use(
            undefined, 
            function(error) {
                if(error.response.status === 401){
                    window.location.href = 'http://localhost:3000/login';
                }
                return false;
            }
          );
    }


    async saveFile(url, data){
        
        const response = await axios.post(`${this.basicUrl}${url}`, data);

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }


    async postRequest(url, data={}){

        const response = await axios.post(`${this.basicUrl}${url}`, {data: data, token: localStorage.getItem('jwtToken')}).catch(e => {
        });
            
        if(response) {
            return response.data;
        }
        else {
            return false;
        }
    }

}

export default CrmApi;