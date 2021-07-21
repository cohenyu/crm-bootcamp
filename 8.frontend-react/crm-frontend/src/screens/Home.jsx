import React from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import '../styles/crmPage.css'
import GroupedBar from '../components/groupedBar/GroupedBar';
import LineChart from '../components/lineChart/LineChart';



function Home(props) {


    return (
        <div className='page-container'>
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