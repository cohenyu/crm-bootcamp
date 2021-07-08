// import React from 'react';
import '../styles/formStyle.css';
import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import CrmButton from './CrmButton';
import validate from '../helpers/validationHelper';


function Form(props) {

    const [fields, setFields] = useState(props.fields);
    const [mainError, setMainError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setFields(props.fields);
    }, [props.fields])

    const setValue = (key, value) => {
        const fieldsTemp = {...fields};
        fieldsTemp[key].value = value;
        fieldsTemp[key].error = false;
        setFields(fieldsTemp);
    };

    const submit = async () => {
        // set true
        let data = {};
        const fieldsTmp = {...fields};
        let validationRes = true;

        for(let key in fields){
            data[key] = {}
            data[key].value = fields[key].value;
            data[key].type = fields[key].mainType;

            let isValid = validate(fields[key].mainType, true, fields[key].value);
            if(!isValid){
                fieldsTmp[key].error = true;
                validationRes = false;
            } else {
                fieldsTmp[key].error = false;
            }
        }
        if(!validationRes){
            setFields(fieldsTmp);
            return;
        }
        setIsLoading(true);
        const responseData =  await props.submitHandle(data); //async - response from backend validation
        if(responseData){
            const invalidFields = responseData.errors;
            if(invalidFields){
                for(let field in fieldsTmp){
                    fieldsTmp[field].error = false;
                }
                for(let errorField of invalidFields){
                    fieldsTmp[errorField].error = true;
                }
                setFields(fieldsTmp);
            }
            console.log("error map: ", props.errorMap);
            setMainError(props.errorMap[responseData.serverError]);
        }
        setIsLoading(false);
        // set false
    };

    const fieldsComponents = [];
    for (let fieldKey in fields){
        const content = fields[fieldKey];
        let error;
        if (content.error){
            if(content.id === 'password' && props.passwordError){
                error = props.passwordError;
            } else {
                error = `Invalid ${content.id}`;
            }
        }
        
        fieldsComponents.push(<FormField 
            errorText={error} 
            text={content.text} 
            type={content.type} 
            value={content.value || ''} 
            key={`${props.type}${content.id}`} 
            callback={(e)=> setValue(fieldKey, e.target.value)}
            />);
    }

    return (

        <div className='form-body'>
            <h2>{props.title}</h2>
            {fieldsComponents}
            <div className='button-wrapper'>
                <CrmButton content={props.button} buttonClass={props.buttonClass} isLoading={isLoading} callback={()=> submit()}/>
            </div>
            <div className='server-error'>
            <span>{mainError}</span>
            </div>
        </div>
    );
}

export default Form;
