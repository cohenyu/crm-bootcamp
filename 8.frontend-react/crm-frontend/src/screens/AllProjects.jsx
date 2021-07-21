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
         const result = await crmApi.postRequest("/projects/getAllProjects/", {user: props.mine});
         setData(result);
         submitTab(props.mine ? statusMap.inProgress.key : statusMap.open.key);
        })();
      }, [props.mine])

   
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

    if (status != statusMap.open.key){
        basicCols.push(...newCols);
    }

    return basicCols;
}


    const submitUpdateProject = async (dataToSent) => {
        const res = await crmApi.postRequest("/projects/updateProject/", {projectId: projectDetailsRef.current.project_id, user: true, set:{project_status: statusMap.inProgress.key, estimated_time: dataToSent.hours.value}});
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
        <div className='page-container'>
            <Header/>
            <div className='crm-page'>
              <PageTitle 
                  className='page-title' 
                  title={props.mine ? 'My Projects' : 'All Projects'} 
                  description='Manage your projects.'
                />
            <div className = {isTableShow ? 'table-actions-box':  'table-actions-box just-one-item'}>
              {isTableShow && 
              <TabsTable 
                submit={submitTab} 
                status={projectStatus} 
                mode={props.mine ? "myProjects" : "allProjects"}
              />}
              {!props.mine && 
              <Link 
                className='button-link' 
                to='/addProject'>
                  <CrmButton 
                    content='Add Project' 
                    buttonClass='main-button' 
                    icon='plus' 
                    isLoading={false} 
                    callback={()=> {}}
                  />
              </Link>
              }
            </div>
            { isTableShow ? 
              <Table columns={columnsData} data={filteredData} clickRow={handleProjectClick}/> 
              : 
              <Calendar/>
            }
            <Modal 
              isOpen={isProjectModalOpen} 
              ariaHideApp={false} 
              contentLabel='Project' 
              onRequestClose={closeProjectWindow}  
              overlayClassName="Overlay" 
              className='modal'>
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