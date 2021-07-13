import React from 'react';
import './pageTitle.scss'

function PageTitle(props){

    return (
        <div className='page-title-container'>
            <h1 className='page-title'>{props.title}</h1>
            {/* <p className='page-description'>{props.description}</p> */}
            <div className='page-description'>
                {props.description}
                </div>
        </div>
    );
}

export default PageTitle;