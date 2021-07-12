import React, { useState, useEffect } from 'react';
import FormField from '../formField/FormField';
import CrmButton from '../crmButton/CrmButton';
import validate from '../../helpers/validationHelper';
import Search from '../search/Search';
import './form.scss';


function Form(props) {

    const [fields, setFields] = useState(props.fields);
    const [mainError, setMainError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setFields(props.fields);
    }, [props.fields])

    const setValue = (key, value, isMultiple=false) => {
        const fieldsTemp = {...fields};
        if(isMultiple) {
            for(let fieldName in value.body){
                fieldsTemp[fieldName].value = value.body[fieldName];
            }
        } else {
            fieldsTemp[key].value = value;
            fieldsTemp[key].error = false;
        }
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
            setMainError(props.errorMap[responseData.serverError]);
        }
        setIsLoading(false);
        // set false
    };

    const fieldsComponents = [];
    const sideFieldsComponents = [];
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

        let comp;
        if(content.id == 'search'){
            comp =  <div key={'search'}>
                <Search {...content} callback={(values)=> setValue(fieldKey, values, true)}/>
                {props.afterSearch && <h3>{props.afterSearch}</h3>}
                </div>
        } else {
            comp = <FormField 
            errorText={error} 
            text={content.text} 
            type={content.type} 
            label={content.label || ''}
            value={content.value || ''} 
            key={`${props.type}${content.id}`} 
            callback={(e)=> setValue(fieldKey, e.target.value)}
            />
        }
        if(content.side){
            sideFieldsComponents.push(comp);
        } else {
            fieldsComponents.push(comp);
        }
    }

    return (

        <div className='form-body'>
            <h2>{props.title}</h2>
            <h3>{props.text}</h3>
            <div className='fields'> 
                <div className='left-side'>
                {fieldsComponents}
                </div>
                <div>
                {sideFieldsComponents}
                </div>
            </div>
            <div>
            </div>
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
