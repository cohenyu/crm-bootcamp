import PageTitle from '../components/pageTitle/PageTitle';
import React, {useState, useEffect, useRef} from 'react';
import '../styles/actionModal.css';
import '../styles/crmPage.css'
import '../styles/modal.scss';
import CrmApi from '../helpers/CrmApi';
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import { Link, useHistory } from 'react-router-dom';

const crmApi = new CrmApi();

function Clients(props){
    const [data, setData] = useState([]);
    const dataRef = useRef(data);
    dataRef.current = data;
    let history = useHistory();
    
    useEffect(()=>{
      console.log("in effect");
      (async () => {
       const result = await getClientsList();
       setData(result);
      })();
    }, [])

        
    const getClientsList = async () => {
      let clients = await crmApi.getAllClients();
      if(clients){
          return clients;
      }
    };

    console.log("after effect");
    
  
   const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'client_name', // accessor is the "key" in the data

      },
      {
        Header: 'Mail',
        accessor: 'client_mail',
        Cell: ({value})  => <a className='link-table' href={`mailto:${value}`}>{value}</a>
      },
      {
        Header: 'Phone',
        accessor: 'client_phone',
        Cell: ({value})  => <a className='link-table' href={`tel:${value}`}>{value}</a>
      },
    ],
    []
  )

  const handleClickRow  = (row) => {
    console.log(row);
    history.push(`/client/${row.original.client_id}`);
    //   {
    //   pathname: '/client',
    //   state: {client_id: row.original.client_id, prev: 'all clients'}
    // });
  }
    

    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='All Clients' description='Manage your clients.'/>
            <Table columns={columns} data={data} clickRow={handleClickRow}/>
            </div>
        </div>
    );
}

export default Clients;