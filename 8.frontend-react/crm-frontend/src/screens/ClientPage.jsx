import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import statusMap from '../helpers/StatusMap';
import { Link, useHistory, useParams } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';
import Table from '../components/table/Table';
import TabsTable from '../components/tabsTable/TabsTable';
import PrevPage from '../components/prevPage/PrevPage'

function ClientPage(props) {
    const crmApi = new CrmApi();
    let history = useHistory();
    const [data, setData] = useState([]);
    const [projectStatus, setProjectStatus] = useState(statusMap.open);
    const [filteredData, setFilteredData] = useState([]);
    const dataRef = useRef(data);
    dataRef.current = data;
    const {clientId} = useParams();
    const [columnsData, setCols] = useState(getCols("open"));
    const [currentClient, setCurrentClient] = useState({});

    useEffect(() => {
        (async () => {
            const result = await crmApi.getAllProjects(false, clientId);
            console.log(result[0]);
            setData(result);
            submitTab(statusMap.open);
            //  setFilteredData(result);
        })();

        (async () => {
            const result = await crmApi.getClient(clientId);
            if(result){
                setCurrentClient(result);
            } else {
                // send to home or clients
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

        if (status != statusMap.open){
            basicCols.push(...newCols)
        }

        return basicCols;
    }

    const handleProjectClick = (row) => {
        history.push({
            pathname: '/project',
            state: { projectId: row.original.project_id, prev: 'client page' }
        });
        
    }

    const submitTab = (status) => {
        setProjectStatus(status);
        setCols(getCols(status))
        const filtered = dataRef.current.filter((item) => {
            return item.project_status === status;
        })
        setFilteredData(filtered);
    }

    return (
        <div>
            <Header />
            <div className='crm-page'>
                <PageTitle className='page-title' title={currentClient.client_name} 
                description={
                <div>
                    
                    <a className='link-table' href={`mailto:${currentClient.client_mail}`}>{currentClient.client_mail}</a>
                    <a className='link-table' href={`tel:${currentClient.client_phone}`}>{currentClient.client_phone}</a>
                    
                </div>}
                // description={`${currentClient.client_mail} | ${currentClient.client_phone}`} 
                />
                <div className='table-actions-box'>
                    <TabsTable submit={submitTab} status={projectStatus} mode='allProjects' />
                </div>
                <Table columns={columnsData} data={filteredData} clickRow={handleProjectClick} />
            </div>
        </div>
    );
}

export default ClientPage;