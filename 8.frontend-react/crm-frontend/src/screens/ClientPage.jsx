import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import statusMap from '../helpers/StatusMap';
import {useHistory, useParams } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';
import Table from '../components/table/Table';
import TabsTable from '../components/tabsTable/TabsTable';
import CrmButton from '../components/crmButton/CrmButton';

function ClientPage(props) {
    const crmApi = new CrmApi();
    let history = useHistory();
    const [data, setData] = useState([]);
    const [projectStatus, setProjectStatus] = useState(statusMap.open);
    const [filteredData, setFilteredData] = useState([]);
    const dataRef = useRef(data);
    dataRef.current = data;
    const {clientId} = useParams();
    const [columnsData, setCols] = useState(getCols(statusMap.open.key));
    const [currentClient, setCurrentClient] = useState({});

    useEffect(() => {
        // Get all projects of the current client
        (async () => {
            const result = await crmApi.postRequest("/projects/getAllProjects/", {user: false, client: clientId});
            setData(result);
            submitTab(statusMap.open.key);
        })();

        // Get the details of the client
        (async () => {
            const result = await crmApi.postRequest("/clients/getClient/", {clientId: clientId});
            if(result){
                setCurrentClient(result);
            } else {
                history.push('/home');
            }
        })();

    }, [])


    const parseDate = (date) => {
        return date.split(' ')[0].split('-').reverse().join('/');
    }


    function getCols(status) {
        const newCols = [
            {
                Header: 'Assigned User',
                accessor: 'user_name',
            }
        ]

        const basicCols = [{
            Header: 'Type',
            accessor: 'item_type',

        },
        {
            Header: 'Date',
            accessor: 'created',
            Cell: ({ value }) => {
                return parseDate(value);
            }
        },
        {
            Header: 'Deadline',
            accessor: 'deadline',
            Cell: ({ value }) => {
                return parseDate(value);
            }
        }]

        if (status !== statusMap.open.key){
            basicCols.push(...newCols)
        }

        return basicCols;
    }

    /**
     * Moves to project page
     * @param {project details} row 
     */
    const handleProjectClick = (row) => {
        history.push(`/project/${row.original.project_id}`);
    }

    /**
     * Filters the projects by the given status
     * @param {project status} status 
     */
    const submitTab = (status) => {
        setProjectStatus(status);
        setCols(getCols(status))
        const filtered = dataRef.current.filter((item) => {
            return item.project_status === status;
        })
        setFilteredData(filtered);
    }

    return (
        <div className='page-container'>
            <Header />
            <div className='crm-page'>
                <PageTitle 
                    className='page-title' 
                    title={currentClient.client_name} 
                    description={
                        <div>
                            <a className='link-table' href={`mailto:${currentClient.client_mail}`}>{currentClient.client_mail}</a>
                            <a className='link-table' href={`tel:${currentClient.client_phone}`}>{currentClient.client_phone}</a>
                        </div>
                    }
                />
                <div className='table-actions-box'>
                    <TabsTable 
                            submit={submitTab} 
                            status={projectStatus} 
                            mode='allProjects' 
                    />
                    <CrmButton 
                            content='Add Project' 
                            buttonClass='main-button' 
                            icon='plus' isLoading={false} 
                            callback={()=> {history.push({
                                            pathname: '/addProject',
                                            state: { client: currentClient }}
                            )}}/>
                </div>
                <Table 
                    columns={columnsData} 
                    data={filteredData} 
                    clickRow={handleProjectClick} 
                />
            </div>
        </div>
    );
}

export default ClientPage;