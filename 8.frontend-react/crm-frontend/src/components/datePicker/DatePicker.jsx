import React, {useEffect, useState} from 'react';
import './datePicker.scss';


function DatePicker(props) {

    const [dates, setDates] = useState([]);
    useEffect(()=>{
        const buttons = [];
        for(let date of props.buttons){
            buttons.push(
                <span 
                    key={date} 
                    onClick={()=>{props.handleClick(date)}} 
                    className={props.current === date ? 'range current': 'range'}>{date}
                </span>
            )
        }
        setDates(buttons);
    }, [props.current])


    return (
        <div className='dates-container'>
            {dates}
        </div>
    );
}

export default DatePicker;