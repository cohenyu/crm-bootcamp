import React from 'react';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import '../styles/crmPage.css'
import Chat from '../components/chat/Chat';


function ChatScreen(props) {

    window.onmessage = function(e) {
        console.log(e.data);
        
    };

    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='Chat'/>
            <Chat/>
            </div>
        </div>
    );
}

export default ChatScreen;