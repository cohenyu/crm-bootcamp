import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../navigation/Navigation';
import Logo from '../logo/Logo';
import AuthApi from '../../helpers/authApi';
import CrmApi from '../../helpers/CrmApi';
import './header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {useHistory } from 'react-router-dom';
import { useSelector , useDispatch} from 'react-redux';
import {changedIsLogged} from '../../reduxData/actions'
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
    const working = useSelector(state => state.working);
    const dispatch = useDispatch();

    const links = [
        {
            title: "Dashboard", 
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
            title: "Chat", 
            url: '/chat'
        }, 
        {
            title: "Settings", 
            url: '/5'
        }
    ];

    useEffect(()=>{
        (async () => {
            const result = await crmApi.postRequest("/workingTime/isWorking/");
            if(result && result.length > 0){
                setIsWorking(true);
            } 
        })();
    }, []);


    const logoutFunc = async ()=>{
        await authApi.logout();
        dispatch(changedIsLogged());
        if (typeof window.setUserDetails === "function"){
            window.setUserDetails();      
        }  
    }

    return (
        <div className="header-container">
            <div className='nav-logo' onClick={()=>{history.push('/home')}}>
            <Logo size='xsmall'/>
            </div>
            <div className='crm-nav-container'>
                <Navigation links={links}/>
            </div>
            <div 
                className='nav-wrapper' 
                onMouseEnter={()=>{setIsHoverPersonal(true)}}  
                onMouseLeave={()=>{setTimeout(()=>{if(!inPersonalRef.current){setIsHoverPersonal(false)};}, 700)}} >
                <div className={`is-working ${working !== 0 ? 'working' : 'not-working'}`}></div>
                <FontAwesomeIcon 
                    className='nav-icon'  
                    icon={faUserCircle} 
                    size='2x'
                />
            </div>
            {isHoverPersonal && 
                <div 
                    className='personal' 
                    onMouseEnter={()=>{setInPersonal(true)}}  
                    onMouseLeave={()=>{setInPersonal(false);setIsHoverPersonal(false);}}
                >
                    <span>Personal Settings</span>
                    <span onClick={logoutFunc}>Logout</span>
                </div>
            }
        </div>
    );
}

export default Header;