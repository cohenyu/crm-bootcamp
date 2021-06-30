import React from 'react';

function PageTitle(props){

    return (
        <div className='page-title-container'>
            <h1 className='page-title'>{props.title}</h1>
            <p className='page-description'>{props.description}</p>
        </div>
    );
}

export default PageTitle;