import React, { useEffect, useState, useRef } from 'react';
import './miniProjectsList.scss';
import Table from '../table/Table';
import Modal from 'react-modal';
import Form from '../form/Form';
import CrmApi from '../../helpers/CrmApi';
import statusMap from '../../helpers/StatusMap';
import { useHistory } from 'react-router';

const crmApi = new CrmApi();

function MiniProjectsList(props){
    const [projects, setProjects] = useState([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [modalProjectDetails, setModalProjectDetails] = useState({});
    const [projectDetails, setProjectDetails] = useState({});
    const projectDetailsRef = useRef(projectDetails);
    projectDetailsRef.current = projectDetails;
  
    const history = useHistory();

    
    useEffect(()=>{
        setProjects(props.projectsList);
    }, [props.projectsList])

    const getUpdateDetails = (details) => {
      return {
        projectId: projectDetailsRef.current.project_id, 
        user: true, 
        set: {
                project_status: statusMap.inProgress.key, 
                estimated_time: details.hours.value
              }
        }
    }

    const submitUpdateProject = async (dataToSent) => {
      const res = await crmApi.postRequest("/projects/updateProject/", getUpdateDetails(dataToSent));
      if(res > 0){
        history.push(`/project/${projectDetailsRef.current.project_id}`);
      }
  };

    //  // project modal settings
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

     // Getting the title and text of the project to show them in the modal
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

    const columns =
        [
          {
            Header: 'Type',
            accessor: 'item_type', 
    
          },
          {
            Header: 'Deadline',
            accessor: 'deadline',
          },
          {
            Header: 'Passed Days',
            accessor: 'passed_days',
          },
        ];
        

      const handleClickRow = (row) => {
        openProjectWindow(row);
      }

    return (
        <div className='projects-container chart-view'>
            <h3 className='title'>{props.title}</h3>
            <Table tableClass='projects-table' columns={columns} data={projects} clickRow={handleClickRow}/>
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
        </div>
    );
}

export default MiniProjectsList;