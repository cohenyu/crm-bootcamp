import React from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import '../styles/crmPage.css'
import '../styles/styles.scss'


function Home(props) {


    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='Home'/>
            </div>
        </div>
    );
}

export default Home;