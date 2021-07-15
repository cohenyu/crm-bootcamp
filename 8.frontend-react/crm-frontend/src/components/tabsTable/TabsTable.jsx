
import React from 'react';
import './tabsTable.scss'
import statusMap from '../../helpers/StatusMap'
const TabsTable = (props) => {

  const tabs = [];
  for(let status in statusMap){
    if(props.mode !== "allProjects" && statusMap[status] == statusMap.open){
      continue;
    }
    tabs.push(<button key={status} className={props.status === statusMap[status].key ? 'active-tab': ''} onClick={(e)=>{props.submit(statusMap[status].key)}}>{statusMap[status].title}</button>);
  }
  return (
      <div>
            <div className='tabs-container'>
              {tabs}
                {/* {props.mode === "allProjects" && <button className={props.status === 'open' ? 'active-tab': ''} onClick={(e)=>{props.submit(statusMap.open)}}>open</button>}
                <button className={props.status === 'in progress' ? 'active-tab': ''} onClick={(e)=>{props.submit(statusMap.inProgress)}}>in progress</button>
                <button className={props.status === 'done' ? 'active-tab': ''} onClick={(e)=>{props.submit(statusMap.done)}}>done</button>
                <button className={props.status === 'closed' ? 'active-tab': ''} onClick={(e)=>{props.submit(statusMap.closed)}}>closed</button>
                <button className={props.status === 'canceled' ? 'active-tab' : ''} onClick={(e)=>{props.submit(statusMap.canceled)}}>canceled</button> */}
            </div>
      </div>
  );
}

export default TabsTable