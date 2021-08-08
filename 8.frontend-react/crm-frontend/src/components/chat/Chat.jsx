import React from 'react';
import './chat.scss';


function Chat(props) {

    const rooms = {}

    return (
        <div className='chat-container'>
           <iframe className='chat' src="http://localhost:9034/crm"></iframe>
        </div>
    );
}

export default Chat;