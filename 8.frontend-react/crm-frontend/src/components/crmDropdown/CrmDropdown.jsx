import React from 'react';
import './crmDropdown.scss';

function CrmDropdown(props) {

    const options = [];
    for(let option in props.options){
        const curOption = props.options[`${option}`]
        options.push(<option value={curOption.key} key={curOption.key}>{curOption.title}</option>);
    }

    return (
        <div>
            <select className='dropdown' defaultValue={props.default} onChange={props.handleChange}>
                {options}
            </select>
        </div>
    );
}

export default CrmDropdown;