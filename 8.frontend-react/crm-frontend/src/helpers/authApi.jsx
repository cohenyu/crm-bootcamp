
const axios = require('axios');

class AuthApi {
    constructor(){
        this.basicUrl = 'http://rgb.com:8005';
    }
    

    async logout(){
       axios.post('http://rgb.com:8005/logout', {}, 
        {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        }).catch(()=>{});
        localStorage.removeItem('jwtToken'); 
    }

    async ping(){
        const response = await axios.get(`${this.basicUrl}/ping`, 
        {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        })
        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

    async getAuth(){
        const response = await axios.get(`${this.basicUrl}/getUser`, 
        {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        })
        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

    async signin(data) {
        const response = await axios.post(`${this.basicUrl}/login`, data);
        
        if(response){
            const token  = response.data.accessToken;
            if(response.data.valid && token){
                localStorage.setItem('jwtToken', token);
            }
            return response.data;
        }
        return null;
    }

    async signup(data){
        const response = await axios.post(`${this.basicUrl}/signup`, data);
        if(response){
            const token  = response.data.accessToken;
            if(response.data.valid && token){
                localStorage.setItem('jwtToken', token);
            }
            return response.data;
        }
        return null; 
    }

    async editUser(data){
        const response = await axios.post(`${this.basicUrl}/editUser`, data);
        if(response){
            const token  = response.data.accessToken;
            if(response.data.valid && token){
                localStorage.setItem('jwtToken', token);
            }
            return response.data;
        }
        return null; 
    }


    async newUser(data){
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(`${this.basicUrl}/addUser`, {token: token, fields: data});
        if(response) {
            return response.data;
        }
        return null; 
    }

    async forgotPassword(data){
        const response = await axios.post(`${this.basicUrl}/forgotPassword`, data).catch((err)=>{return false});
        return response.data;
    }

    async resetPassword(data){
        const response = await axios.post(`${this.basicUrl}/resetPassword`, data).catch((err)=>{return false});
        return response.data;
    }

    async checkTokenValidation(data){
        const response = await axios.get(`${this.basicUrl}/tokenValidation`, {
            headers: {
                'authorization': data.mailToken
            }
        }).catch((err)=>{return false});
        return response.data;
    }

    async getUsers(){
        const response = await axios.get(`${this.basicUrl}/getUsers`, 
        {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        })
        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

    async deleteUser(data){
        const response = await axios.post(`${this.basicUrl}/removeUser`, data, {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        })
        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

    async editOldUser(data){
        const response = await axios.post(`${this.basicUrl}/editOldUser`, data, {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        });
        return response ? response.data : null;
    }

    async sendMsgs(data){
        const response = await axios.post(`${this.basicUrl}/sendMsgs`, data, {
            headers: {
                'authorization': localStorage.getItem('jwtToken')
            }
        });
        return response ? response.data : null;
    }
}


export default AuthApi;
