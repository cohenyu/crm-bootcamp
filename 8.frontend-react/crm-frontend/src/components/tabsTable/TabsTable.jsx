
import React from 'react';
import './tabsTable.scss'
import statusMap from '../../helpers/StatusMap'
const TabsTable = (props) => {

  const tabs = [];
  for(let status in statusMap){
    if(props.mode !== "allProjects" && statusMap[status] == statusMap.open){
      continue;
    }
    tabs.push(<button 
                      key={status} 
                      className={props.status === statusMap[status].key ? 'active-tab': ''} 
                      onClick={(e)=>{props.submit(statusMap[status].key)}}
              >
                        {statusMap[status].title}
              </button>);
  }
  return (
      <div>
            <div className='tabs-container'>
              {tabs}
            </div>
      </div>
  );
}

export default TabsTable