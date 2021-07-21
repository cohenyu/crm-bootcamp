import React, { useEffect, useState } from 'react';
import PageTitle from '../components/pageTitle/PageTitle';
import Header from '../components/header/Header';
import Form from '../components/form/Form';
import { Link, Redirect, useHistory, BrowserRouter } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';
import statusMap from '../helpers/StatusMap'
import PrevPage from '../components/prevPage/PrevPage';
import CrmButton from '../components/crmButton/CrmButton';
import FormField from '../components/formField/FormField';
import Search from '../components/search/Search';
import '../styles/addProject.scss'
import validate from '../helpers/validationHelper';
const crmApi = new CrmApi(); 

function AddProject(props){

    let history = useHistory();
    const clientData = (history.location.state && history.location.state.client) ? history.location.state.client : null;
    const [serverError, setServerError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);

    const mapFunc = (data) => {
      return {main: data.client_name, second: [data.client_mail, data.client_phone], details: {name: data.client_name, mail: data.client_mail, phone: data.client_phone, clientId: data.client_id}};
    }

    const [projectFields, setProjectFields] = useState({
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
      }
    });

    const [clientFields, setClientFields] = useState({
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
      clientId: {
      hidden: true,
      id: "client-id",
      type: 'hidden',
      error: false,
      mainType: 'hidden',
      value: clientData ? clientData.client_id : '',
    }
    });

    const validationFields = (fields, setFieldsObject) => {
      const fieldsTmp = {...fields};
      let isValidationSucceed = true;

      for(let key in fields){
          if(fields[key].mainType === 'hidden'){
              continue;
          }
          let isValid = validate(fields[key].mainType, true, fields[key].value);
          if(!isValid){
              fieldsTmp[key].error = true;
              isValidationSucceed = false;
          } else {
            console.log('removing the error from ', key);
              fieldsTmp[key].error = false;
          }
      }
      setFieldsObject(fieldsTmp);
      return isValidationSucceed;
    }

    
    const submitAddProject = async () => {
      setIsLoading(true);
      const validClient = validationFields(clientFields, setClientFields);
      const validProject = validationFields(projectFields, setProjectFields);
      if(validClient && validProject){
        const data = {};
        for(let field in clientFields){
          data[field] = {type: clientFields[field].mainType, value:clientFields[field].value}
        }
        for(let field in projectFields){
          data[field] = {type: projectFields[field].mainType, value:projectFields[field].value}
        }
        
        if(!data.clientId.value){
          delete data.clientId;
        }
        
        const resultData = await crmApi.postRequest("/projects/addProject/", {status: statusMap.open.key, fields: data});
        console.log("result from add project",resultData);
        if(resultData > 0){
          history.push(`/allProjects`);
        } else {
          setServerError('Error');
        }
        
      }
      setIsLoading(false);

    };

    const setValue = (form, setFunction, field, value) => {
        const tempData = {...form};
        if(value != ''){
          let isValid = validate(form[field].mainType, true, value);
          tempData[field].error = !isValid; 
        } else {
          tempData[field].error = false; 
        }
        form[field].value = value;
        setFunction(tempData);
    }

    const createField = (fieldsData, setFunction)=>{
      const projectForm = [];
      for(let fieldKey in fieldsData){
        const content = fieldsData[fieldKey];
        let error = '';
        if(content.error){
          error = `Invalid ${content.id}`;
        }
        projectForm.push(<FormField 
          isDisabled = {content.isDisabled || false}
          min = {content.min}
          errorText={error} 
          text={content.text} 
          type={content.type} 
          label={content.label || ''}
          value={content.value || ''} 
          key={`${props.type}${content.id}`} 
          callback={(e)=> setValue(fieldsData, setFunction, fieldKey, e.target.value)}
          />)
      }
      return projectForm;
    }

    const setSearchValues = (values) => {
      const clientFieldsTemp = {...clientFields};
      for(let item in values){
        clientFieldsTemp[item].value = values[item];
        clientFieldsTemp[item].isDisabled = true;
      }
      console.log(clientFieldsTemp);
      setClientFields(clientFieldsTemp);
    }

    const handleCancelSearch = ()=>{
      const values = ['name', 'phone', 'mail', 'clientId']
      const clientFieldsTemp = {...clientFields};
      for(let item of values){
        clientFieldsTemp[item].value = '';
        clientFieldsTemp[item].isDisabled = false;
      }
      console.log(clientFieldsTemp);
      setClientFields(clientFieldsTemp);
    }
    
    return (
        <div className='page-container'>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title={'Add New Project'} description={''}/>
            <div className='add-project-container'>
            <h2>Project Details</h2>
              <div className='add-project-body'>
              <div>
              {createField(projectFields, setProjectFields)}
              </div>
              <div>
              <Search {...{
                id: 'clientSearch',
                type: 'search',
                side: true,
                text : 'Search Client',
                fetchData:  async (input) => {
                  console.log("input: ", input);
                  return await crmApi.postRequest("/clients/getAllClients/", {input: input, limit: 3})},
                mapFunc: mapFunc,
                mainType: 'hidden',
              }} callback={(values)=> setSearchValues(values)}/>
              <h3>OR</h3>
              {createField(clientFields, setClientFields)}
              {console.log(clientFields.clientId.value != '' ? true : false)}
              <div className='cancel-button'>
              <CrmButton isDisabled={clientFields.clientId.value != '' ? false : true} content='Cancel' buttonClass={!clientFields.clientId.value ? 'disabled': 'secondary-button'} containerClass= {'form-action'} callback={()=> {handleCancelSearch()}}/>
              </div>
              </div>
              </div>
              <div className='button-wrapper'>
                <CrmButton  content='Add' buttonClass='main-button' isLoading={isLoading} callback={()=> submitAddProject()}/>
              </div>
              <div className='server-error'>
                <span>{serverError}</span>
              </div>
            </div>
            </div>
        </div>
    );
}

export default AddProject;