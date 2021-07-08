import React from 'react';
import '../styles/navigation.css'
import {
    // BrowserRouter as Router,
    Link,
  } from "react-router-dom";

function Navigation(props) {
    
    const linksList = [];
    for (let link of props.links){
        linksList.push(<Link className='nav-link' key={link.url} to={link.url}>{link.title}</Link>)
    }

    return (
        <div className="nav-container">
            <nav className="nav-menu">
            <ul>
                {linksList}
            </ul>
            </nav>
        </div>
    );
}

export default Navigation;