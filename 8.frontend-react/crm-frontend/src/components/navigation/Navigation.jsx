import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import './navigation.scss';

function Navigation(props) {
    
    const [isHoverList, setIsHoverList] = useState(new Array(props.links.length).fill(false));
    const isHoverListRef = useRef(isHoverList);
    isHoverListRef.current = isHoverList;
    const [isInSubMenu, setInSubMenu] = useState(new Array(props.links.length).fill(false));
    const isInSubMenuRef = useRef(isInSubMenu);
    isInSubMenuRef.current = isInSubMenu;

    const handleHoverNav = (index, bool) => {
        const tempHoverList = new Array(props.links.length).fill(false);
        tempHoverList[index] = bool;
        setIsHoverList(tempHoverList);
    };

    const handleInSubMenu = (index, bool) => {
        const tempHoverList = [...isInSubMenu];
        tempHoverList[index] = bool;
        setInSubMenu(tempHoverList);
    };

    const handleMouseLeaveNav = (index) => {
        setTimeout(() => {
            if(!isInSubMenuRef.current[index]){
                handleHoverNav(index, false)
            }
        }, 700);
    }

    const handleMouseLeaveSub = (index) => {
        handleInSubMenu(index, false); 
        handleHoverNav(index, false);
    }

    const navList = [];
    props.links.forEach((link, index)=>{
        if(link.url){
            navList.push(<li key={link.title}>
                            <Link 
                                className='nav-link' 
                                key={link.title} 
                                to={link.url}>{link.title}
                            </Link>
                        </li>);
        } else {
            let subLinks = []
            for(let sublink of link.subLinks){
                subLinks.push(<li key={sublink.title}>
                                    <Link className='nav-link' 
                                            key={sublink.title} 
                                            to={sublink.url}
                                    >
                                        {sublink.title}
                                    </Link>
                                </li>);
            }
            navList.push(<li key={link.title}>
                <div 
                    onMouseEnter={()=>{handleHoverNav(index, true)}}  
                    onMouseLeave={handleMouseLeaveNav(index)}>
                    <Link 
                        className='nav-link' 
                        key={link.title} 
                        to='#'
                        >
                            {link.title}
                    </Link>
                    <FontAwesomeIcon className='nav-icon' icon={faCaretRight} size='xs'/>
                </div>
                {isHoverListRef.current[index] && 
                <ul onMouseEnter={()=>{handleInSubMenu(index, true)}}  
                    onMouseLeave={()=>{handleMouseLeaveSub(index)}} 
                    className="dropdown">{subLinks}</ul>}
                </li>);
        }
    });

    return (
        <div className="nav-container">
            <nav role="navigation" className="primary-navigation">
                <ul>{navList}</ul>
            </nav>
        </div>
    );
}

export default Navigation;

