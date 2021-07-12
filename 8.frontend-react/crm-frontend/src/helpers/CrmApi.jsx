import axios from 'axios';

class CrmApi {

    constructor(){
        this.basicUrl = 'http://localhost:9991';
    }

    async getAllProjects(isUser, clientId=-1){
        const data = {user: isUser};
        if(clientId !== -1){
            data.client = clientId;
        }
        console.log(data);
        const response = await axios.post(`${this.basicUrl}/projects/getAllProjects/`, {...data, token: localStorage.getItem('jwtToken')});

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

    async addProject(data){
        const response = await axios.post(`${this.basicUrl}/projects/addProject/`, {...data, token: localStorage.getItem('jwtToken')});

        if(response){
            return response.data;
        }
        else {
            return false;
        }
    }
}

export default CrmApi;