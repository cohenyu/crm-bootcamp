import axios from 'axios';

class CrmApi {

    constructor(){
        this.basicUrl = 'http://localhost:9991';
    }

    async getAllProjects(isUser){
        const response = await axios.post(`${this.basicUrl}/projects/getAllProjects/`, {user: isUser, token: localStorage.getItem('jwtToken')});

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

    async getAllClients(searchInput=''){
        const response = await axios.post(`${this.basicUrl}/clients/getAllClients/`, {input: searchInput, token: localStorage.getItem('jwtToken')});

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }

    async updateProject(data){
        const response = await axios.post(`${this.basicUrl}/projects/updateProject/`, {...data, token: localStorage.getItem('jwtToken')});

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }
}

export default CrmApi;