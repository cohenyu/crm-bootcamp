import React, { useEffect, useState } from 'react';
import PageTitle from '../components/pageTitle/PageTitle';
import Header from '../components/header/Header';
import Form from '../components/form/Form';
import { Link, Redirect, useHistory, BrowserRouter } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';
import statusMap from '../helpers/StatusMap'
import PrevPage from '../components/prevPage/PrevPage';
const crmApi = new CrmApi(); 

function AddProject(props){

    let history = useHistory();
    const clientData = (history.location.state && history.location.state.client) ? history.location.state.client : null;

    const submitAddProject = async (formFieldsData) => {
      console.log("success", formFieldsData);
      if(!formFieldsData.clientId.value){
        delete formFieldsData.clientId;
      }
      delete formFieldsData.search;
      const resultData = await crmApi.addProject({status: statusMap.open.key, fields: formFieldsData});
      console.log(resultData);
      if(resultData > 0){
        history.push(`/project/${resultData}`);
      }
      // TODO error
    };


    const mapFunc = (data) => {
      return {main: data.client_name, second: [data.client_mail, data.client_phone], details: {name: data.client_name, mail: data.client_mail, phone: data.client_phone, clientId: data.client_id}};
    }

    const [addFormData, setAddFormData] = useState({
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
            mainType: 'text',
          },
          deadline: {
            text: '2021-07-12',
            value: new Date().toISOString().substr(0, 10),
            min: new Date().toISOString().substr(0, 10),
            label: "Deadline",
            id: "date",
            type: 'date',
            error: false,
            mainType: 'date',
          }, 
          search: {
            id: 'clientSearch',
            type: 'search',
            side: true,
            text : 'Search Client',
            fetchData:  async (input) => {return await crmApi.getAllClients(input, 3)},
            mapFunc: mapFunc,
            mainType: 'hidden',
          },
          name: {
            side: true,
            text: "Client Full Name",
            id: "name",
            type: 'text',
            error: false,
            mainType: 'name',
            isDisabled: !!clientData,
            value: clientData ? clientData.client_name : '',
          },
          mail: {
            side: true,
            text: "Client Mail",
            id: "mail",
            type: 'text',
            error: false,
            mainType: 'mail',
            isDisabled: !!clientData,
            value: clientData ? clientData.client_mail : '',
          },
          phone: {
            side: true,
            text: "Client Phone Number",
            id: "phone",
            type: 'text',
            error: false,
            mainType: 'phone',
            isDisabled: !!clientData,
            value: clientData ? clientData.client_phone : '',
          },
          cancel: {
            side: true,
            text: 'Cancel',
            type: 'button',
            id: "cancel",
            isDisabled: false,
            buttonClass: 'secondary-button',
            mainType: 'hidden',
            submit: ()=>{
              const tempData = {...addFormData};
              const fieldsToChange = ['name', 'mail', 'phone', 'clientId'];
              for(let field of fieldsToChange){
                tempData.fields[field].value = '';
                tempData.fields[field].isDisabled = false;

              }
              tempData.fields.cancel.isDisabled = true;
              setAddFormData(tempData);
            },
          },
          clientId: {
            hidden: true,
            side: true,
            text: '',
            id: "client-id",
            type: 'hidden',
            error: false,
            mainType: 'hidden',
            value: clientData ? clientData.client_id : '',
          },
        }
      });


    return (
        <div>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title={''} description={''}/>
            <Form 
                    className='form-body'
                    {...addFormData}
                />
            </div>
        </div>
    );
}

export default AddProject;