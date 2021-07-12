import PageTitle from '../components/pageTitle/PageTitle';
import CrmButton from '../components/crmButton/CrmButton';
import React, {useState, useMemo, useEffect, useRef} from 'react';
import ReactDom from 'react-dom';
// import Form from '../components/Form';
import Form from '../components/form/Form';
import '../styles/actionModal.css';
import Modal from 'react-modal';
import '../styles/crmPage.css'
import '../styles/modal.scss';
// import '../styles/modalWindow.css';
import AuthApi from '../helpers/authApi';
import CrmApi from '../helpers/CrmApi';
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash , faEdit} from '@fortawesome/free-solid-svg-icons'


const authApi = new AuthApi();
const crmApi = new CrmApi();

function Clients(props){
    var isLoading = false;
    const [itemToDelete, setItemToDelete] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const dataRef = useRef(data);
    dataRef.current = data;


        
    const getClientsList = async () => {
      let clients = await crmApi.getAllClients();
      if(clients){
          return clients;
      }
    };

    useEffect(()=>{
      (async () => {
       const result = await getClientsList();
       setData(result);
      })();
    }, [])

   
   const onRemoveItem = (value) => {
     setItemToDelete(value);
     openDeleteProjectWindow();
   }
   
   const removeItem = () => {
    // authApi.deleteUser(itemToDelete);
    // console.log("item to delete", itemToDelete);
    // let newData = dataRef.current.filter((item)=>{
    //   console.log(itemToDelete.project_id,"is equal?", item.user_id);
    //   return itemToDelete.user_id != item.user_id;
    // })
    // closeDeleteProjectWindow();
    // setData(newData);
   }
    
  
   const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'client_name', // accessor is the "key" in the data

      },
      {
        Header: 'Mail',
        accessor: 'client_mail',
        Cell: ({value})  => <a className='link-table' href={`tel:${value}`}>{value}</a>
      },
      {
        Header: 'Phone',
        accessor: 'client_phone',
        Cell: ({value})  => <a className='link-table' href={`tel:${value}`}>{value}</a>
      },
      // {
      //   Header: 'Action',
      //   // accessor: 'delete',
      //   Cell: (value)=> (
      //     <div>
      //       <span style={{cursor:'pointer'}}
      //           onClick={() => {
      //             // console.log(value);
      //               onRemoveItem(value.cell.row.original);
      //             }}>
      //             <FontAwesomeIcon className='trash-icon' icon={faTrash} size='sm'/>
      //     </span> 
      //     </div>
          
      //   )
      // },

    ],
    []
  )


    const openDeleteProjectWindow = ()=>{
      setIsDeleteModalOpen(true);
    };

    const closeDeleteProjectWindow = ()=>{
        setIsDeleteModalOpen(false);
    };

    

    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='All Clients' description='Manage your clients.'/>
            <Table columns={columns} data={data}/>
            <Modal isOpen={isDeleteModalOpen} ariaHideApp={false} contentLabel='Remove Project' onRequestClose={closeDeleteProjectWindow}  overlayClassName="Overlay" className='modal'>
                <h2>Are you sure you want delete this item?</h2>
                <div className='action-buttons-modal'>
                <CrmButton content='Delete' buttonClass='main-button' isLoading={isLoading} callback={()=> removeItem()}/>
                <CrmButton content='Cancel' buttonClass='secondary-button' isLoading={isLoading} callback={()=> closeDeleteProjectWindow()}/>
                </div>
            </Modal>
            </div>
        </div>
    );
}

export default Clients;