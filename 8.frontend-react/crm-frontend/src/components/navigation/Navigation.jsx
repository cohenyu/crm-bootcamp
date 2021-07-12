import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import './navigation.scss';

function Navigation(props) {
    
    // const linksList = [];
    // for (let link of props.links){
    //     linksList.push(<Link className='nav-link' key={link.url} to={link.url}>{link.title}</Link>);
    // }

    const navList = [];
    for (let link of props.links){
        if(link.url){
            navList.push(<li key={link.title}><Link className='nav-link' key={link.title} to={link.url}>{link.title}</Link></li>);
        } else {
            let subLinks = []
            for(let sublink of link.subLinks){
                subLinks.push(<li key={sublink.title}><Link className='nav-link' key={sublink.title} to={sublink.url}>{sublink.title}</Link></li>);
            }
            navList.push(<li key={link.title}><Link className='nav-link' key={link.title} to='#'>{link.title}</Link><FontAwesomeIcon className='nav-icon' icon={faCaretDown} size='xs'/><ul className="dropdown">{subLinks}</ul></li>);
        }
    }

    return (
        <div className="nav-container">
            <nav role="navigation" className="primary-navigation">
                <ul>{navList}</ul>
            </nav>
        </div>
    );
}

export default Navigation;

