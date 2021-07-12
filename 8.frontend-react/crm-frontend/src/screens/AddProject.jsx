import React from 'react';
import PageTitle from '../components/pageTitle/PageTitle';
import Header from '../components/header/Header';
import Form from '../components/form/Form';
import { Link } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';

const crmApi = new CrmApi(); 

function AddProject(props){

    const submitAddProject = async (formFieldsData) => {

    };


    const mapFunc = (data) => {
      return {main: data.client_name, second: [data.client_mail, data.client_phone], details: {body: {name: data.client_name, mail: data.client_mail, phone: data.client_phone}, clientId: data.client_id}};
    }

    const addProjectForm = {
        submitHandle: submitAddProject,
          type: 'addProject',
          title: "Add New Project",
          errorMap: {
            'serverError': 'Try again later',
            'clientNotExist': 'Client not exist'
          },
          button: 'Add',
          buttonClass: 'main-button',
          afterSearch: 'OR',
          fields: {
            type: {
              text: "Item Type",
              id: "type",
              type: 'text',
              error: false,
              mainType: 'name',
            },
            description: {
              text: "Description",
              id: "description",
              type: 'textarea',
              error: false,
              mainType: 'name',
            },
            deadline: {
              text: '2021-07-12',
              value: new Date().toISOString().substr(0, 10),
              label: "Deadline",
              id: "date",
              type: 'date',
              error: false,
              mainType: 'date',
            }, 
            search: {
              id: 'search',
              side: true,
              text : 'Search Client',
              fetchData:  async (input) => {return await crmApi.getAllClients(input)},
              mapFunc: mapFunc
            },
            name: {
              side: true,
              text: "Client Full Name",
              id: "name",
              type: 'text',
              error: false,
              mainType: 'name'
            },
            mail: {
              side: true,
              text: "Client Mail",
              id: "mail",
              type: 'text',
              error: false,
              mainType: 'mail'
            },
            phone: {
              side: true,
              text: "Client Phone Number",
              id: "phone",
              type: 'text',
              error: false,
              mainType: 'phone'
            },
          }
        }

    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <Link className='linkto' to="/allProjects">{"< Back"}</Link>
            <PageTitle className='page-title' title={''} description={''}/>
            <Form 
                    className='form-body'
                    {...addProjectForm}
                />
            </div>
        </div>
    );
}

export default AddProject;