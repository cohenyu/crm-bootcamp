import axios from 'axios';

class CrmApi {

    constructor(){
        this.basicUrl = 'http://localhost:9991';
    }

    async test(){
        const response = await axios.get(`${this.basicUrl}/test/test/yuval/`);

        if(response){
            console.log(response);
        }
        else {
            return false;
        }
    }
}

export default CrmApi;