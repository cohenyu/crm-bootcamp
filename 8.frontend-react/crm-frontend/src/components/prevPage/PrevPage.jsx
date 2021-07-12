import React from 'react';
import './prevPage.scss';
import {useHistory } from 'react-router-dom';

function PrevPage(props) {

    let history = useHistory();
    console.log(history);
    return (
        <div>
            <div  className='linkto' onClick={history.goBack}>
                {`< Back`}
            </div>
        </div>
    );
}

export default PrevPage;