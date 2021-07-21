import React from 'react';
import { Link } from "react-router-dom";
import './message.scss'


function Massage(props) {

    const linksList = [];
    for (let link of props.links){
        linksList.push(<Link className='linkto' key={link.url} to={link.url}>{link.title}</Link>)
    }

    return (
        <div className="massage-container">
           <p>{props.massage}</p>
           {linksList}
        </div>
    );
}

export default Massage;