import React from 'react';
import Loader from "react-loader-spinner";
import './loading.scss';

function Loading(props) {
    
    return (
        <div className='loader-container'> 
                  <Loader
                    type="ThreeDots"
                    color={props.color}
                    height={props.height}
                    width={props.width}
                  />
        </div>
    );
}

export default Loading;
