import React from 'react';
import './formField.scss';


function FormField(props) {
    var error = `error-${props.id}`;
    
    return (
        <div className='fieldContainer' >
            {props.label && <label>{props.label}</label>}
            {
            props.type === "textarea" ? 
            <textarea className='form-input' rows='6' value={props.value} placeholder={props.text} onChange={props.callback}/> 
            : 
            <input className='form-input' min={props.min} id={props.id} type={props.type} value={props.value} onChange={props.callback}  placeholder={props.text}/>
            }
            {props.type !== "hidden" &&<span className='field-error' id={error}>{props.errorText}</span>}
        </div>
    );
}

export default FormField;
