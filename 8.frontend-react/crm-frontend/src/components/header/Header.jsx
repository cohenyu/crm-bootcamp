import React from 'react';
import Navigation from '../navigation/Navigation';
import Logo from '../logo/Logo';
import AuthApi from '../../helpers/authApi';
import CrmButton from '../crmButton/CrmButton';
import './header.scss';

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
            <Logo size='xsmall'/>
            <div className='links-container'>
                <Navigation links={links}/>
                </div>
            <div className='nav-wrapper' >
            <CrmButton buttonClass='spacial-button' content='Log Out' callback={()=> logoutFunc()}/>
            {/* <button id="logout" onClick={()=>logoutFunc()}>Logout</button> */}
            </div>
        </div>
    );
}

export default Header;