import React from 'react';
import './prevPage.scss';
import {useHistory } from 'react-router-dom';

function PrevPage(props) {

    let history = useHistory();
    console.log(history);
    return (
        <div>
            <div  className='linkto' onClick={history.goBack}>
                {/* {`< Back to ${history.location.state.prev}`} */}
                {`< Back to}`}
            </div>
        </div>
    );
}

export default PrevPage;