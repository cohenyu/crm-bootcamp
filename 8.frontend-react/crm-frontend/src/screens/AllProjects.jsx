import PageTitle from '../components/pageTitle/PageTitle';
import CrmButton from '../components/crmButton/CrmButton';
import React, {useState, useEffect, useRef} from 'react';
import Form from '../components/form/Form';
import TabsTable from '../components/tabsTable/TabsTable';
import '../styles/actionModal.css';
import Modal from 'react-modal';
import '../styles/crmPage.css'
import '../styles/modal.scss';
import CrmApi from '../helpers/CrmApi';
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';
import statusMap from '../helpers/StatusMap';
import ScrollUp from '../components/scrollUp/ScrollUp';
import Calendar from '../components/calendar/Calendar';

const crmApi = new CrmApi();

function AllProjects(props){
    let history = useHistory();
    const [itemToDelete, setItemToDelete] = useState({});
    const [modalProjectDetails, setModalProjectDetails] = useState({});
    const [projectDetails, setProjectDetails] = useState({});
    const projectDetailsRef = useRef(projectDetails);
    projectDetailsRef.current = projectDetails;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTableShow, setITableShow] = useState(true);
    const [data, setData] = useState([]);
    const [projectStatus, setProjectStatus] = useState(props.mine ? statusMap.inProgress.key : statusMap.open.key);
    const [filteredData, setFilteredData] = useState([]);
    const mineRef = useRef(props.mine);
    mineRef.current = props.mine;
    const dataRef = useRef(data);
    dataRef.current = data;
    const [columnsData, setCols] = useState(getCols(statusMap.open.key));

    useEffect(()=>{
        (async () => {
          console.log("mine? ", props.mine);
         const result = await crmApi.getAllProjects(props.mine);
         console.log(result);
         setData(result);
         submitTab(props.mine ? statusMap.inProgress.key : statusMap.open.key);
        //  setFilteredData(result);
        })();
      }, [props.mine])

   
   const parseDate = (date) => {
        return date.split(' ')[0].split('-').reverse().join('/');
   }
   
   const onRemoveItem = (value) => {
     setItemToDelete(value);
     openDeleteProjectWindow();
   }
   
   const removeItem = () => {
       console.log("removing");
      //   TODO
       setIsDeleteModalOpen(false);
   }


  function getCols(status) {

    const newCols = [
      {
          Header: 'Assigned User',
          accessor: 'user_name',
      }
  ]

    const basicCols = [
      {
        Header: 'Type',
        accessor: 'item_type',

      },
      {
        Header: 'Client',
        accessor: 'client_name',
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
    ];

    const lastCols = [{
      Header: 'Action',
      // accessor: 'delete',
      Cell: (value)=> (
        <div>
          <span style={{cursor:'pointer'}}
              onClick={(event) => {
                  onRemoveItem(value.cell.row.original);
                  event.stopPropagation();
                }}>
                <FontAwesomeIcon className='trash-icon' icon={faTrash} size='sm'/>
        </span> 
        </div>
        
      )
    },]

    if (status != statusMap.open.key){
        basicCols.push(...newCols);
    }
    basicCols.push(...lastCols);

    return basicCols;
}

    const openDeleteProjectWindow = ()=>{
      setIsDeleteModalOpen(true);
    };

    const closeDeleteProjectWindow = ()=>{
        setIsDeleteModalOpen(false);
    };

    const submitUpdateProject = async (dataToSent) => {
        const res = await crmApi.updateProject({project_id: projectDetailsRef.current.project_id, user: true, set:{project_status: statusMap.inProgress.key, estimated_time: dataToSent.hours.value}});
        console.log("here", res);
        if(res > 0){
          history.push(`/project/${projectDetailsRef.current.project_id}`);
        }
        // TODO error
    };

    
    // project modal settings
    const projectModal = {
        submitHandle: submitUpdateProject,
        type: 'project',
        title: '',
        text: '',
        errorMap: {
          'serverError': 'Try again later',
          'clientNotExist': 'Client not exist'
        },
        button: 'Assign To Me',
        buttonClass: 'main-button',
        fields: {
          hours: {
            min: 1,
            text: "Estimated Time (hours)",
            id: "hours",
            type: 'number',
            error: false,
            mainType: 'number',
          },
        }
      }

      // Get the title and text of the project and show it in the modal
      const openProjectWindow = ({original}) => {
        let tempFormDetails  = {...projectModal};
        tempFormDetails.text = original.description;
        tempFormDetails.title = original.item_type;
        setProjectDetails(original)
        setModalProjectDetails(tempFormDetails);
        setIsProjectModalOpen(true);
      };
  
    // closing the project modal description
      const closeProjectWindow = ()=>{
          setIsProjectModalOpen(false);
      };

    const submitTab = (status) =>{
        setProjectStatus(status);
        setCols(getCols(status));
        const filtered = dataRef.current.filter((item)=>{
            return item.project_status === status;
        })
        setFilteredData(filtered);
    }

    const handleProjectClick = (row) => {
      if(!mineRef.current && projectStatus == statusMap.open.key){
        openProjectWindow(row);
      } else {
        history.push(`/project/${row.original.project_id}`);
      }
    }

    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title={props.mine ? 'My Projects' : 'All Projects'} description='Manage your projects.'/>
            <div className= {isTableShow ? 'table-actions-box':  'table-actions-box just-one-item'}>
            {isTableShow && <TabsTable submit={submitTab} status={projectStatus} mode={props.mine ? "myProjects" : "allProjects"}/>}
            {!props.mine && 
             <Link className='button-link' to='/addProject'><CrmButton content='Add Project' buttonClass='main-button' icon='plus' isLoading={false} callback={()=> {}}/></Link>
            }
            </div>
            { isTableShow ? 
            <Table columns={columnsData} data={filteredData} clickRow={handleProjectClick}/> : <Calendar/>}
            
            {/* <ActionModal title='Are you sure you want delete this item?' isLoading={false} ok='Delete' cancel='Cancel' onClose={()=> {setIsDeleteModalOpen(false)}} isOpen={isDeleteModalOpen} action={removeItem}/> */}
            {/* <Modal isOpen={isDeleteModalOpen} ariaHideApp={false} contentLabel='Remove Project' onRequestClose={closeDeleteProjectWindow}  overlayClassName="Overlay" className='modal'>
                <h2>Are you sure you want delete this item?</h2>
                <div className='action-buttons-modal'>
                <CrmButton content='Delete' buttonClass='main-button' isLoading={isLoading} callback={()=> removeItem()}/>
                <CrmButton content='Cancel' buttonClass='secondary-button' isLoading={isLoading} callback={()=> closeDeleteProjectWindow()}/>
                </div>
            </Modal> */}
            <Modal isOpen={isProjectModalOpen} ariaHideApp={false} contentLabel='Project' onRequestClose={closeProjectWindow}  overlayClassName="Overlay" className='modal'>
            <Form 
                    className='form-body'
                    {...modalProjectDetails}
                />
            </Modal>
            <ScrollUp/>
            </div>
        </div>
    );
}

export default AllProjects;