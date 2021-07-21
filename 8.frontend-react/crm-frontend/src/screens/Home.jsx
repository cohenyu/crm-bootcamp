import React, {useState} from 'react';
import AuthApi from '../helpers/authApi';
import Header from '../components/Header';
import CrmButton from '../components/CrmButton';
import PageTitle from '../components/PageTitle';
import '../styles/crmPage.css'
import GroupedBar from '../components/groupedBar/GroupedBar';
import LineChart from '../components/lineChart/LineChart';

const authApi = new AuthApi();



function Home(props) {


    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='Home'/>
            <GroupedBar title='Estimated vs actual project cost'/>
            <LineChart title='Max working hours'/>
            </div>
        </div>
    );
}

export default Home;