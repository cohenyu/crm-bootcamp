import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config';
import { canInstrument } from 'babel-jest';

class AuthService {

    constructor(){
        this.basicUrl = 'http://localhost:8005';
    }


    /**
     * Sends request to login the user
     * @param {object} data - user details
     * @returns response data if the request succeed, false otherwise
     */
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

    /**
     * Sends request to get user details by the jwt token
     * @returns response's data if the request succeed and the token has verified, false otherwise
     */
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