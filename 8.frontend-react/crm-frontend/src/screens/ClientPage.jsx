import React, {useState, useEffect, useRef} from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import statusMap from '../helpers/StatusMap';
import { Link, useHistory, BrowserRouter } from 'react-router-dom';
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
    const clientId = history.location.state.client_id;
    const [cols, setCols] = useState([]);

    useEffect(()=>{
        (async () => {
         const result = await crmApi.getAllProjects(false, clientId);
         setData(result);
         submitTab(statusMap.open);
        //  setFilteredData(result);
        })();
      }, [props.mine])


    const parseDate = (date) => {
        return date.split(' ')[0].split('-').reverse().join('/');
   }

   let columnsData  = [
    {
      Header: 'Type',
      accessor: 'item_type',

    },
    {
      Header: 'Date',
      accessor: 'created',
      Cell: ({value}) => {
          return parseDate(value);
      }
    },
    {
      Header: 'Deadline',
      accessor: 'deadline',
      Cell: ({value}) => {
          return parseDate(value);
      }
    },
  ]

//   if(projectStatus !== statusMap.open){
//     columnsData.push({
//         Header: 'Assigned User',
//         accessor: 'assigned_user_id',
//     })
//   } else {
//     columnsData = columnsData.filter((item)=>{
//         return item.accessor !== 'assigned_user_id';
//     })
//   }
//   setCols(React.useMemo(
//     () => columnsData,
//     []
// ))
  
    const columns = React.useMemo(
        () => columnsData,
        []
    )

      const handleProjectClick = (row) => {
        history.push({
            pathname: '/project',
            state: {projectId: row.original.project_id}
          });
        console.log(row);
      }

      const submitTab = (status) =>{
        setProjectStatus(status);
        const filtered = dataRef.current.filter((item)=>{
            return item.project_status === status;
        })
        setFilteredData(filtered);
    }

    return (
        <div>
            <Header/>
            <div className='crm-page'>
                {clientId}
                <PrevPage/>
                <PageTitle className='page-title' title={'Client'} description={'Client details'}/>
                <div className='table-actions-box'>
                    <TabsTable submit={submitTab} status={projectStatus} mode='allProjects'/>
                </div>
                <Table columns={columns} data={filteredData} clickRow={handleProjectClick}/>
            </div>
        </div>
    );
}

export default ClientPage;