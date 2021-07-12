import React from 'react';
import './formField.scss';

function FormField(props) {
    var error = `error-${props.id}`;
    return (
        <div className='fieldContainer' >
            {props.label && <label>{props.label}</label>}
            {props.type == "textarea" ? <textarea className='form-input' rows='6' placeholder={props.text}/> : <input className='form-input' min={new Date().toISOString().substr(0, 10)} id={props.id} type={props.type} value={props.value} onChange={props.callback}  placeholder={props.text}/>}
            <span className='field-error' id={error}>{props.errorText}</span>
        </div>
    );
}

export default FormField;
