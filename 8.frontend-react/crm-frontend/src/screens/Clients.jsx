import PageTitle from '../components/pageTitle/PageTitle';
import React, {useState, useEffect, useRef} from 'react';
import '../styles/actionModal.css';
import '../styles/crmPage.css'
import '../styles/modal.scss';
import CrmApi from '../helpers/CrmApi';
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import {useHistory } from 'react-router-dom';

const crmApi = new CrmApi();

function Clients(props){
    const [data, setData] = useState([]);
    const dataRef = useRef(data);
    dataRef.current = data;
    let history = useHistory();
    
    useEffect(()=>{
      (async () => {
       const result = await getClientsList();
       setData(result);
      })();
    }, [])

    /**
     * fetches the client list
     * @returns the list
     */
    const getClientsList = async () => {
      let clients = await crmApi.postRequest("/clients/getAllClients/");
      if(clients){
          return clients;
      }
    };

    
  
   const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'client_name', 

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

  /**
   * Redirect to client page
   * @param {client details} row 
   */
  const handleClickRow  = (row) => {
    history.push(`/client/${row.original.client_id}`);
  }
    

    return (
        <div className='page-container'>
            <Header/>
            <div className='crm-page'>
              <PageTitle 
                className='page-title' 
                title='All Clients' 
                description='Manage your clients.'
              />
              <Table 
                columns={columns} 
                data={data} 
                clickRow={handleClickRow}
              />
            </div>
        </div>
    );
}

export default Clients;