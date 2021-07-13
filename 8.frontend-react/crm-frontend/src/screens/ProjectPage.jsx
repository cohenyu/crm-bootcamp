import React, {useEffect, useState} from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import { Link, useHistory, useParams } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';

function ProjectPage(props) {

    const {projectId} = useParams();
    const [currentProject, setCurrentProject] = useState({});
    const crmApi = new CrmApi();

    useEffect(() => {
        (async () => {
            const result = await crmApi.getProject(projectId);
            if(result){
                console.log(result);
            } else {
                // send to home or projects
            }
        })();

    }, [])
    
    return (
        <div>
            <Header/>
            <div className='crm-page'>
                <div>
                    {projectId}
                </div>
                {/* TODO get the project id from the url and send request for the details */}
            <PageTitle className='page-title' title={'Project'} description={'Project description'}/>
            </div>
        </div>
    );
}

export default ProjectPage;