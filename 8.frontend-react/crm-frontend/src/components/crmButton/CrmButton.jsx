import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faStopwatch, faEnvelope, faComment } from '@fortawesome/free-solid-svg-icons'
import './CrmButton.scss';

function CrmButton(props) {

    const iconsMap  = {
        'plus': faPlus,
        'check': faCheck,
        'stopwatch': faStopwatch,
        'mail': faEnvelope,
        'sms': faComment
    }


    return (
        <div className={"button-container" +  (props.containerClass ? ' ' + props.containerClass : '')}>
            <button disabled={props.isDisabled} className={`submit-button ${props.buttonClass}`} onClick={props.isLoading ? ()=>{} : props.callback}>
                {props.icon && <FontAwesomeIcon className='button-icon' icon={iconsMap[`${props.icon}`]} size={props.size ? props.size : 'xs'}/>}
                {props.isLoading ? 'Loading...' : props.content}
            </button>
        </div>
    );
}

export default CrmButton;