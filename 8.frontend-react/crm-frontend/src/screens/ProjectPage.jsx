import React from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import { Link, useHistory } from 'react-router-dom';
import PrevPage from '../components/prevPage/PrevPage';

function ProjectPage(props) {

    let history = useHistory();
    return (
        <div>
            <Header/>
            <div className='crm-page'>
                <div>
                    {history.location.state.projectId}
                </div>
                {/* TODO get the project id from the url and send request for the details */}
            <PrevPage/>
            <PageTitle className='page-title' title={'Project'} description={'Project description'}/>
            </div>
        </div>
    );
}

export default ProjectPage;