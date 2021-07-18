
import React, {useState, useRef} from 'react';
import './task.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical, faCheck, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import CrmApi from '../../helpers/CrmApi';
import ActionModal from '../actionModal/ActionModal';

function Task(props) {
    const [check, setCheck] = useState(props.done);
    const crmApi = new CrmApi();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditTask, setEditTask] = useState(false);
    const [title, setTitle] = useState(props.title);

    const handleCheckTask =  async (value)=> {
       const result =  await crmApi.updateTask({taskId: props.id, set: {done: value}});
       if(result){
           console.log("task updated");
        }
        setCheck(value);
    }

    const setNewTitle = () => {
        crmApi.updateTask({taskId: props.id, set: {description: title}});
        setTitle(title);
        setEditTask(false);
    }

    return (
        <div className='task'>
            <FontAwesomeIcon icon={faGripVertical} size={'sm'}/>  
            <div className={check ? 'check' : 'check unchecked'} onClick={()=>{handleCheckTask(!check)}}>{check &&  <FontAwesomeIcon icon={faCheck} size={'sm'}/> }</div> 
            {isEditTask ? <input onChange={(e)=>{setTitle(e.target.value)}} value={title} type='text'/>: <span className='title'>{title}</span>}
            <div className='task-actions'>
            <FontAwesomeIcon onClick={()=>{!isEditTask ? setEditTask(!isEditTask) : setNewTitle()}} className='edit' icon={isEditTask? faCheck : faEdit} size={'1x'}/> 
            <FontAwesomeIcon onClick={()=>{setIsDeleteModalOpen(true)}} className='trash' icon={faTrashAlt} size={'1x'}/> 
            </div>
            <ActionModal title='Are you sure you want delete this task?' isLoading={false} ok='Delete' cancel='Cancel' onClose={()=> {setIsDeleteModalOpen(false)}} isOpen={isDeleteModalOpen} action={()=>{props.removeTask(props.id); setIsDeleteModalOpen(false)}}/>
        </div>
    );
}

export default Task;
