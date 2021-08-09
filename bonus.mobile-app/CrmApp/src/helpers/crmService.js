import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config';

class CrmService {

    constructor(){
        this.basicUrl = 'http://localhost:9991';
        axios.interceptors.response.use(
            undefined, 
            function(error) {
                // if(error.response.status === 401){
                //     window.location.href = 'http://localhost:3000/login';
                // }
                return false;
            }
          );
    }



    async postRequest(url, data={}){
        let token = await AsyncStorage.getItem(USER_KEY);
        const response = await axios.post(`${this.basicUrl}${url}`, {data: data, token: token}).catch(e => { console.log(e);
        });
            
        if(response) {
            return response.data;
        }
        else {
            return false;
        }
    }

}

export default CrmService;