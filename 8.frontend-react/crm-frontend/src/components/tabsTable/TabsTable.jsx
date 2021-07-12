
import React from 'react';
import './tabsTable.scss'

const TabsTable = (props) => {


  return (
      <div>
            <div className='tabs-container'>
                {props.page == "allProjects" && <button className={props.status == 'open' ? 'active-tab': ''} onClick={(e)=>{props.submit(e.target.innerText)}}>open</button>}
                <button className={props.status == 'in progress' ? 'active-tab': ''} onClick={(e)=>{props.submit(e.target.innerText)}}>in progress</button>
                <button className={props.status == 'done' ? 'active-tab': ''} onClick={(e)=>{props.submit(e.target.innerText)}}>done</button>
                <button className={props.status == 'closed' ? 'active-tab': ''} onClick={(e)=>{props.submit(e.target.innerText)}}>closed</button>
                <button className={props.status == 'canceled' ? 'active-tab' : ''} onClick={(e)=>{props.submit(e.target.innerText)}}>canceled</button>
            </div>
      </div>
  );
}

export default TabsTable