import React from 'react';
import Navigation from '../navigation/Navigation';
import Logo from '../logo/Logo';
import AuthApi from '../../helpers/authApi';
import CrmButton from '../crmButton/CrmButton';
import './header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight, faUserCircle } from '@fortawesome/free-solid-svg-icons'
const authApi = new AuthApi();

function Header(props) {


    const links = [
        {
            title: "Home", 
            url: '/home'
        }, 
        {
            title: "Projects", 
            subLinks: [
                {
                    title: "All projects", 
                    url: '/allProjects'
                },
                {
                    title: "My projects", 
                    url: '/myProjects'
                }, 
            ]
        }, 
        {
            title: "Clients", 
            url: '/clients'
        }, 
        {
            title: "Team", 
            url: '/team'
        }, 
        {
            title: "Finance", 
            url: '/7'
        }, 
        {
            title: "Settings", 
            url: '/5'
        }
    ];

    const logoutFunc = async ()=>{
        await authApi.logout();
        // TODO - use the state instead of window
        window.location.href = 'http://localhost:3000/login';
        
    }

    return (
        <div className="header-container">
            <div className='nav-logo'>
            <Logo size='xsmall'/>
            </div>
            <div className='crm-nav-container'>
                <Navigation links={links}/>
                </div>
            <div className='nav-wrapper' >
            {/* <CrmButton buttonClass='spacial-button' content='Log Out' callback={()=> logoutFunc()}/> */}
            <FontAwesomeIcon className='nav-icon' icon={faUserCircle} size='2x'/>
            <div className='personal'>
                <span>Personal Settings</span>
                <span onClick={logoutFunc}>Logout</span>
            </div>
            </div>
        </div>
    );
}

export default Header;