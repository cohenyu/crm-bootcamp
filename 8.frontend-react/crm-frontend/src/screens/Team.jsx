import PageTitle from '../components/pageTitle/PageTitle';
import CrmButton from '../components/crmButton/CrmButton';
import React, {useState, useEffect, useRef} from 'react';
import Form from '../components/form/Form';
import '../styles/actionModal.css';
import Modal from 'react-modal';
import '../styles/crmPage.css'
import '../styles/modal.scss';
import AuthApi from '../helpers/authApi';
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash , faEdit, faDownload} from '@fortawesome/free-solid-svg-icons';
import ActionModal from '../components/actionModal/ActionModal';
import CrmApi from '../helpers/CrmApi';
import fileDownload from 'js-file-download';

const authApi = new AuthApi();
const crmApi = new CrmApi();

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


    // Fetches the users
    useEffect(()=>{
      (async () => {
       const result = await getUsersList();
       if(result){
         setData(result);
       }
      })();
    }, [])
    
    /**
     * Sends request to add new user
     * @param {user details} dataToSent 
     * @returns the result from the server if the values aren't valid
     */
    const submit = async (dataToSent) => {
        const res = await authApi.newUser(dataToSent);
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

    /**
     * @param {Users list} table 
     * @returns The users list with a status - pending / active
     */
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

    /**
     * Fetches the users list
     * @returns Users
     */
    const getUsersList = async () => {
      let result = await authApi.getUsers();
      if(result && result.valid){
          result = result.usersList.reverse();
         return tableParser(result);
      }
   };
   
   /**
    * Opens the delete modal
    * @param {item to remove} item 
    */
   const onRemoveItem = (item) => {
     setItemToDelete(item);
     openDeleteUserWindow();
   }
   
   /**
    * Removes the item from users list
    */
   const removeItem = () => {
    authApi.deleteUser(itemToDelete);
    let newData = dataRef.current.filter((item)=>{
      return itemToDelete.user_id !== item.user_id;
    })
    closeDeleteUserWindow();
    setData(newData);
   }
  
  /**
  * Fetches the working hours csv file of the given user
  * @param {user details} row 
  */
  const downloadCsv =  async (row) => {
    const img = await crmApi.postRequest("/workingTime/exportWorkingTimeToCsv/", {userId: row.user_id, userName: row.user_name});
    if(img){
      fileDownload(img, `${row.user_name}.csv`);
    }
  }
  

   const columns = React.useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'user_name', 

      },
      {
        Header: 'Mail',
        accessor: 'user_mail',
        // Add a link to send a mail
        Cell: ({value})  => <a className='link-table' href={`mailto:${value}`}>{value}</a>
      },
      {
        Header: 'Phone',
        accessor: 'user_phone',
        // Add link to make a phone call
        Cell: ({value})  => <a className='link-table' href={`tel:${value}`}>{value}</a>
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({value})  => value === 'active' ? <FontAwesomeIcon className='status-icon' icon={faCheck} size='xs'/> : value
      },
      {
        Header: 'Action',

        Cell: (value)=> (
          <div className='action-icons'>
            {/* Remove action */}
            <span 
              style={{cursor:'pointer'}}
              onClick={() => {
                onRemoveItem(value.cell.row.original);
              }}>
              <FontAwesomeIcon 
                className='trash-icon' 
                icon={faTrash} 
                size='sm'
              />
            {/* Edit action */}
          </span> 
          {value.cell.row.original.user_name && 
            <span style={{cursor:'pointer'}}
                  onClick={() => {
                    setItemToEdit(value.cell.row.original);
                    openEditUserWindow();
                    }}>
                    <FontAwesomeIcon 
                      className='edit-icon' 
                      icon={faEdit} 
                      size='sm'
                    />
            </span> 
          }
          {/* Download csv file action */}
          <span 
              style={{cursor:'pointer'}}
              onClick={ () => {
                    downloadCsv(value.cell.row.original);
                }}>
                <FontAwesomeIcon 
                  className='download-icon' 
                  icon={faDownload} 
                  size='sm'
                />
          </span> 
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
        if(res.valid){
          let newData = dataRef.current.map((item)=>{
            if(item.user_id === itemToEdit.user_id){
              item.user_name = formFieldsData.name.value;
              item.user_mail = formFieldsData.mail.value;
              item.user_phone = formFieldsData.phone.value;
            }
            return item;
          })
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
    };

    const closeEditUserWindow = ()=>{
        setIsEditModalOpen(false);
    };
    

    return (
        <div className='page-container'>
            <Header/>
            <div className='crm-page'>
              <PageTitle 
                  className='page-title' 
                  title='Team' 
                  description='Manage your team.'
              />
              <div className='table-actions-box just-one-item'>
                <CrmButton 
                    content='Add User' 
                    buttonClass='main-button' 
                    icon='plus' 
                    isLoading={isLoading} 
                    callback={()=> openAddUserWindow()}
                />
              </div>
              <Table columns={columns} data={data}/>
              <Modal 
                isOpen={isModalOpen} 
                ariaHideApp={false} 
                contentLabel='Add User' 
                onRequestClose={closeAddUserWindow}  
                overlayClassName="Overlay" 
                className='modal'
                >
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
              <ActionModal 
                  title='Are you sure you want delete this user?' 
                  isLoading={false} 
                  ok='Delete' 
                  cancel='Cancel' 
                  onClose={()=> {setIsDeleteModalOpen(false)}} 
                  isOpen={isDeleteModalOpen} 
                  action={removeItem}
              />
              <Modal 
                  isOpen={isEditModalOpen} 
                  ariaHideApp={false} 
                  contentLabel='Edit User' 
                  onRequestClose={closeEditUserWindow}  
                  overlayClassName="Overlay" 
                  className='modal'
              >
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