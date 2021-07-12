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
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash , faEdit} from '@fortawesome/free-solid-svg-icons';
import ActionModal from '../components/actionModal/ActionModal';


const authApi = new AuthApi();

function Team(props){
    var isLoading = false;
    const [itemToDelete, setItemToDelete] = useState({});
    const [itemToEdit, setItemToEdit] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const dataRef = useRef(data);
    dataRef.current = data;


    const submit = async (dataToSent) => {
        const res = await authApi.newUser(dataToSent);
        console.log("result:", res);
        if(res.valid){
          const newData = [...data];
          const userDetails = res.user;
          userDetails.status = 'pending';
          newData.unshift(res.user);
          setData(newData);
          setIsModalOpen(false);
        } else {
          return res;
        }
    };

    
    function tableParser(table){
      if(table){
        const parseResult = table.map(item => {
          const status =  !item.user_name ? 'pending' : 'active';
          return {
            ...item, 
            status: status
          }
        });
        return parseResult;
      }
      return null;
    }

    const getUsersList = async () => {
      let result = await authApi.getUsers();
      if(result && result.valid){
          result = result.usersList.reverse();
         return tableParser(result);
      }
   };

   useEffect(()=>{
    (async () => {
      console.log('execute get users');
     const result = await getUsersList();
     console.log(result);
     setData(result);
    })();
  }, [])
   
   
   const onRemoveItem = (value) => {
     setItemToDelete(value);
     openDeleteUserWindow();
   }
   
   const removeItem = () => {
    authApi.deleteUser(itemToDelete);
    console.log("item to delete", itemToDelete);
    let newData = dataRef.current.filter((item)=>{
      console.log(itemToDelete.user_id,"is equal?", item.user_id);
      return itemToDelete.user_id != item.user_id;
    })
    closeDeleteUserWindow();
    setData(newData);
   }
  
    
  
   const columns = React.useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'user_name', // accessor is the "key" in the data

      },
      {
        Header: 'Mail',
        accessor: 'user_mail',
        Cell: ({value})  => <a className='link-table' href={`mailto:${value}`}>{value}</a>
      },
      {
        Header: 'Phone',
        accessor: 'user_phone',
        Cell: ({value})  => <a className='link-table' href={`tel:${value}`}>{value}</a>
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({value})  => value == 'active' ? <FontAwesomeIcon className='status-icon' icon={faCheck} size='xs'/> : value
      },
      {
        Header: 'Action',
        // accessor: 'delete',
        Cell: (value)=> (
          <div>
            <span style={{cursor:'pointer'}}
                onClick={() => {
                  // console.log(value);
                    onRemoveItem(value.cell.row.original);
                  }}>
                  <FontAwesomeIcon className='trash-icon' icon={faTrash} size='sm'/>
          </span> 
          {value.cell.row.original.user_name && <span style={{cursor:'pointer'}}
                onClick={() => {
                  setItemToEdit(value.cell.row.original);
                  openEditUserWindow();
                  }}>
                  <FontAwesomeIcon className='edit-icon' icon={faEdit} size='sm'/>
          </span> }
          </div>
          
        )
      },

    ],
    []
  )

    const addUserForm = {
      submitHandle: submit,
        type: 'addUser',
        title: "Add user",
        errorMap: {
          'serverError': 'Try again later',
          'userMailAlreadyExist': 'User mail already exist'
        },
        buttonTitle: 'Add',
        buttonClass: 'main-button',
        fields: {
          mail: {
            text: "Enter User Mail",
            id: "mail",
            error: false,
            mainType: 'mail'
          }
        }
    }

    const submitEditUser = async (formFieldsData) => {
        const res = await authApi.editOldUser({fields: formFieldsData, userId: itemToEdit.user_id});
        console.log(res.valid);
        if(res.valid){

          let newData = dataRef.current.map((item)=>{
            if(item.user_id == itemToEdit.user_id){
              item.user_name = formFieldsData.name.value;
              item.user_mail = formFieldsData.mail.value;
              item.user_phone = formFieldsData.phone.value;
            }
            return item;
          })
          console.log(newData);
          
          setData(newData);
          closeEditUserWindow();
        } else {
          return res;
        }
    };

    const editUserForm = {
      submitHandle: submitEditUser,
      type: 'editUser',
      title: "Edit user details",
      errorMap: {
        'serverError': 'Try again later',
        'userMailAlreadyExist': 'User mail already exist'
      },
      buttonTitle: 'Save',
      buttonClass: 'main-button',
      fields: {
        name: {
          text: "Full Name",
          id: "name",
          type: 'text',
          error: false,
          mainType: 'name',
          value: itemToEdit.user_name
        },
        mail: {
          text: "Enter User Mail",
          id: "mail",
          error: false,
          mainType: 'mail',
          value: itemToEdit.user_mail
        },
        phone: {
          text: "Phone Number",
          id: "phone",
          type: 'text',
          error: false,
          mainType: 'phone',
          value: itemToEdit.user_phone
        }, 
      }
    }



    const openAddUserWindow = ()=>{
        setIsModalOpen(true);
    };

    const closeAddUserWindow = ()=>{
        setIsModalOpen(false);
    };

    const openDeleteUserWindow = ()=>{
      setIsDeleteModalOpen(true);
    };

    const closeDeleteUserWindow = ()=>{
        setIsDeleteModalOpen(false);
    };

    const openEditUserWindow = ()=>{
      setIsEditModalOpen(true);
      console.log('item ', itemToEdit);
    };

    const closeEditUserWindow = ()=>{
        setIsEditModalOpen(false);
    };
    

    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='Team' description='Manage your team.'/>
            <div className='table-actions-box just-one-item'>
            <CrmButton content='Add User' buttonClass='main-button' icon='plus' isLoading={isLoading} callback={()=> openAddUserWindow()}/>
            </div>
            <Table columns={columns} data={data}/>
            <Modal isOpen={isModalOpen} ariaHideApp={false} contentLabel='Add User' onRequestClose={closeAddUserWindow}  overlayClassName="Overlay" className='modal'>
                <Form 
                    className='form-body'
                    fields={addUserForm.fields} 
                    title={addUserForm.title}
                    type={addUserForm.type}
                    errorMap={addUserForm.errorMap}
                    button= {addUserForm.buttonTitle}
                    buttonClass={addUserForm.buttonClass}
                    submitHandle={addUserForm.submitHandle} 
                />
            </Modal>
            <ActionModal title='Are you sure you want delete this User?' isLoading={false} ok='Delete' cancel='Cancel' onClose={()=> {setIsDeleteModalOpen(false)}} isOpen={isDeleteModalOpen} action={removeItem}/>
            {/* <Modal isOpen={isDeleteModalOpen} ariaHideApp={false} contentLabel='Remove User' onRequestClose={closeDeleteUserWindow}  overlayClassName="Overlay" className='modal'>
                <h2>Are you sure you want delete this item?</h2>
                <div className='action-buttons-modal'>
                <CrmButton content='Delete' buttonClass='main-button' isLoading={isLoading} callback={()=> removeItem()}/>
                <CrmButton content='Cancel' buttonClass='secondary-button' isLoading={isLoading} callback={()=> closeDeleteUserWindow()}/>
                </div>
            </Modal> */}
            <Modal isOpen={isEditModalOpen} ariaHideApp={false} contentLabel='Edit User' onRequestClose={closeEditUserWindow}  overlayClassName="Overlay" className='modal'>
            <Form 
                    className='form-body'
                    button= {editUserForm.buttonTitle}
                    submitHandle={editUserForm.submitHandle} 
                    {...editUserForm}
                />
            </Modal>
            </div>
        </div>
    );
}

export default Team;