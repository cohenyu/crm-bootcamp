import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../navigation/Navigation';
import Logo from '../logo/Logo';
import AuthApi from '../../helpers/authApi';
import CrmApi from '../../helpers/CrmApi';
import './header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {useHistory } from 'react-router-dom';
const authApi = new AuthApi();
const crmApi = new CrmApi();

function Header(props) {
    const [isHoverPersonal, setIsHoverPersonal] = useState(false);
    const isHoverPersonalRef = useRef(isHoverPersonal);
    isHoverPersonalRef.current = isHoverPersonal;
    const [inPersonal, setInPersonal] = useState(false);
    const inPersonalRef = useRef(inPersonal);
    inPersonalRef.current = inPersonal;
    const history = useHistory();
    const [isWorking, setIsWorking] = useState(false);

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

    useEffect(()=>{
        (async () => {
            const result = await crmApi.isWorking();
            if(result){
                setIsWorking(true);
            } 
        })();
    }, []);

    const logoutFunc = async ()=>{
        await authApi.logout();
        // history.push('/login')
        // TODO - use the state instead of window
        window.location.href = 'http://localhost:3000/login';
        
    }

    return (
        <div className="header-container">
            <div className='nav-logo' onClick={()=>{history.push('/home')}}>
            <Logo size='xsmall'/>
            </div>
            <div className='crm-nav-container'>
                <Navigation links={links}/>
                </div>
            <div className='nav-wrapper' onMouseEnter={()=>{setIsHoverPersonal(true)}}  onMouseLeave={()=>{setTimeout(()=>{if(!inPersonalRef.current){setIsHoverPersonal(false)};}, 700)}} >
            <div className={`is-working ${isWorking? 'working' : 'not-working'}`}></div>
            <FontAwesomeIcon className='nav-icon'  icon={faUserCircle} size='2x'/>
            </div>
            {isHoverPersonal && <div className='personal' onMouseEnter={()=>{setInPersonal(true)}}  onMouseLeave={()=>{setInPersonal(false);setIsHoverPersonal(false);; console.log("leave from personal")}}>
                <span>Personal Settings</span>
                <span onClick={logoutFunc}>Logout</span>
            </div>
            }
        </div>
    );
}

export default Header;