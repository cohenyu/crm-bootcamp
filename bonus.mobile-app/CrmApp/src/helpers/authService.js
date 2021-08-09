import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config';
import { canInstrument } from 'babel-jest';

class AuthService {

    constructor(){
        this.basicUrl = 'http://localhost:8005';
    }


    async login(data){

        const response = await axios.post(`${this.basicUrl}/login`, data).catch(e => {console.log(e);
        });
            
        if(response) {
            const token  = response.data.accessToken;
            if(response.data.valid && token){
                await AsyncStorage.setItem(USER_KEY, token);
            }
            return response.data;
        }
        else {
            return false;
        }
    }

    async getUser(){
        let user = await AsyncStorage.getItem(USER_KEY);

        // user token doesn't exist
        if(!user){
            return false;
        }

        const response = await axios.get(`${this.basicUrl}/getUser`, 
        {
            headers: {
                'authorization': user
            }
        }).catch((err)=>{console.log(err)});

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

}

export default AuthService;