import React from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import '../styles/crmPage.css'
import Chat from '../components/chat/Chat';
import CrmApi from '../helpers/CrmApi';

function ChatScreen(props) {
    const crmApi = new CrmApi();
    window.onmessage = async function(e) {
        if(e.data.name && e.data.mail && e.data.phone){
            const response = await crmApi.postRequest('/clients/addClient/', {
                                                                                name: e.data.name, 
                                                                                mail: e.data.mail, 
                                                                                phone: e.data.phone
                                                                            });
        }
    };

    return (
        <div className='page-container'>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='Chat'/>
            <Chat/>
            </div>
        </div>
    );
}

export default ChatScreen;