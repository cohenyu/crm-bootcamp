import React from 'react';
import './formField.scss';


function FormField(props) {
    var error = `error-${props.id}`;

    const getInput = (type) => {
        if(type == "textarea"){
            return <textarea 
            disabled={props.isDisabled} 
            className='form-input' 
            rows='6' 
            value={props.value} 
            placeholder={props.text} 
            onChange={props.callback}/> 
        } else {
            return <input disabled={props.isDisabled} 
            className='form-input' min={props.min} 
            id={props.id} type={props.type} 
            value={props.value} 
            onChange={props.callback}  
            placeholder={props.text}/>
        }
    }
    
    return (
        <div className='fieldContainer' >
            {props.label && <label>{props.label}</label>}
            {getInput(props.type)}
            {props.type !== "hidden" && <span className='field-error' id={error}>{props.errorText}</span>}
        </div>
    );
}

export default FormField;
