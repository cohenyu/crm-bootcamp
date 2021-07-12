import React from 'react';
import AuthApi from '../helpers/authApi';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import '../styles/crmPage.css'
import CrmApi from '../helpers/CrmApi';
import '../styles/styles.scss'
import {
    // BrowserRouter as Router,
    Link,
    useParams,
    withRouter,
    useHistory
  } from "react-router-dom";

const crmApi = new CrmApi();



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