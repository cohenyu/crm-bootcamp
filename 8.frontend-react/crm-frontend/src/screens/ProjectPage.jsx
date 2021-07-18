import React, {useEffect, useState, useRef} from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import { Link, useHistory, useParams } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';
import Timer from '../components/timer/Timer';
import CrmButton from '../components/crmButton/CrmButton';
import '../styles/projectPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faStopwatch, faUserCircle, faPaperclip, faEdit, faPlus, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import statusMap from '../helpers/StatusMap';
import ImgProject from '../components/imgProject/ImgProject';
import CrmDropdown from '../components/crmDropdown/CrmDropdown';
import Task from '../components/task/Task';
import {DndProvider} from "react-dnd";
import DragDrop from '../components/dragDrop/DragDrop';
import {HTML5Backend} from 'react-dnd-html5-backend'

function ProjectPage(props) {

    const {projectId} = useParams();
    const [currentProject, setCurrentProject] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [workId, setWorkId] = useState(-1);
    const [currentWork, setCurrentWork] = useState({});
    const workRef = useRef(currentWork);
    workRef.current = currentWork;
    const [totalHours, setTotalHours] = useState(0);
    const [daysFromDeadline, setDaysFromDeadline] = useState(0);
    const crmApi = new CrmApi();
    const history = useHistory();
    const inputFile = useRef(null) ;
    const [selectedFile, setSelectedFile] = useState(null);
    const selectedFileRef = useRef(selectedFile);
    selectedFileRef.current = selectedFile;
    const [imgList, setImgList] = useState([]);
    const [imgUploaded, setImgUploaded] = useState(false);
    const [isEditDescription, setIsEditDescription] = useState(false);
    let tempDescription =  currentProject ? currentProject.description: '';
    const [isStatusChanged, setStatusChanged] = useState(false);
    const [addTask,setAddTask] = useState(false);
    let newTaskDescription = '';
    const [tasks, setTasks] = useState([]);



    useEffect(() => {
        (async () => {
            const result = await crmApi.getProject(projectId);
            if(result){
                console.log(result);
                setCurrentProject(result);
                calculateDays(result.deadline);
            } else {
                history.push('/home');
            }
        })();
    }, [isEditDescription, isStatusChanged])

    useEffect(()=>{
        (async ()=>{
            if(currentProject){
                const result = await crmApi.getAllTasks({projectId: currentProject.project_id});
                if(result){
                    console.log(result);
                    const tasksList = result.map((item)=>{
                        return {id: item.task_id, index: item.task_index, title: item.description, done: item.done};
                    })
                    console.log(tasksList)
                    setTasks(tasksList);
                }
            }
        })();
    },[currentProject,addTask]);

    useEffect(() => {
        (async () => {
            const result = await crmApi.getWorkingTime({projectId: projectId});
            if(result){
                let $openWork  = result.works.filter((workingTime)=>{
                    return workingTime.stop_time == null;
                })
                
                if($openWork.length == 1) {
                    setCurrentWork($openWork[0]);
                    setIsWorking(true);
                    setWorkId($openWork[0].work_id);
                }
                setTotalHours(result.total);
            } else {
                // TODO error
            }
        })();
    }, [isWorking])

    useEffect(() => {
        if(selectedFile != null){
            onFileUpload();
        }
    }, [selectedFile]);


    useEffect(() => {
        (async () => {
            const result = await crmApi.getImgs({projectId: projectId});
            if(result){
                setImgList(result);
            } else {
                // TODO error
            }
        })();
    }, [imgUploaded]);
    

    const startWork = async () => {
        setCurrentWork({});
        const result = await crmApi.startWorkingTime({projectId: projectId});
        if(result){
            setWorkId(result);
            setIsWorking(true);
        }
    }

    const stoptWork = async () => {
        console.log("stop");
        const result = await crmApi.stopWorkingTime({workId: workId});
        if(result){
            setIsWorking(false);
            console.log(result);
        } 
    }


    const calculateDays = (deadline) => {
        const days = (new Date(new Date().toISOString().substr(0, 10)).getTime()  - new Date(deadline).getTime()) / (1000 * 3600 * 24);
        setDaysFromDeadline(days);
    }

    const attachClick = () => {
        inputFile.current.click();
    }

    const onFileChange= (e) =>{
        setSelectedFile(e.target.files[0]);
    }

    const onFileUpload = async () => {
        console.log("selected: ",selectedFile);
        const formData = new FormData(); 
        formData.append( 
            "newFile", 
            selectedFile, 
            selectedFile.name 
          );

        console.log("uploaded"); 
        await crmApi.saveImg(formData);
        const result = await crmApi.addImg({img_url: selectedFile.name, clientId: currentProject.client_id, projectId: currentProject.project_id});
        setImgUploaded(!imgUploaded);
        console.log(result);
    }

    const getImgs = () => {
        const imgs = [];
        if(imgList.length > 0){
            imgList.forEach((imgItem, index)=>{
                const path = `http://localhost:9991/imgs/${imgItem.img_url}`;
                imgs.push(<ImgProject imgPath={path} clickHandle={()=>{}} key={index}/>)
            })
        }
        return imgs;
    }

    const submitUpdateDescription = async (newDesc) => {
        if(newDesc != currentProject.description){
            const res = await crmApi.updateProject({project_id: currentProject.project_id, set:{description: newDesc}});
        }
        setIsEditDescription(false);
    };

    const submitUpdateStatus = async (newStatus) => {
        if(newStatus != currentProject.project_status){
            const res = await crmApi.updateProject({project_id: currentProject.project_id, set:{project_status: newStatus}});
        }
        setStatusChanged(!isStatusChanged);
    };

    const handleAddTask = async () => {
       const result = await crmApi.addTask({projectId: currentProject.project_id, description: newTaskDescription});
       if(result) {
           console.log("task added");
           newTaskDescription = '';
           setAddTask(false);
       }
    }

    const dropdownStatusMap = {...statusMap};
    delete dropdownStatusMap.open;
    return (
        <div className='background'>
        <div className='page-container'>
            <Header/>
            {currentProject && 
            <div className='crm-page project-page'>
                <div className='project-header'>
                    <h1>{currentProject.item_type.charAt(0).toUpperCase() + currentProject.item_type.slice(1).toLowerCase()} </h1>
                    <h5>{`Total ${+(totalHours/60).toFixed(2)} Working Hours`}</h5>
                    <div className='dropdown-container'>
                    <span className='mini-title'>STATUS</span>
                    <CrmDropdown handleChange={(e)=>{submitUpdateStatus(e.target.value)}} options={dropdownStatusMap} default={currentProject.project_status}/>
                    </div>
                </div>
                <div className='quick-view'>
                <div>
                        <span className='sub-title'>Estimated Working Hours</span>
                        <div className='count-container'>
                        <span className='counting'>{currentProject.estimated_time}</span>
                        </div>
                    </div>
                {daysFromDeadline <= 0 ? 
                    <div className="due">
                        <span className='sub-title'>Due In</span>
                        <div className='count-container'>
                        <span className='counting'>{Math.abs(daysFromDeadline)}</span>
                        <span className='counting-item'>Days</span>
                        </div>
                    </div> 
                 :
                 <div className="due overdue">
                    <span className='sub-title'>Overdue</span>
                    <div className='count-container'>
                    <span className='counting'>{Math.abs(daysFromDeadline)}</span>
                    <span className='counting-item'>Days</span>
                    </div>
                 </div>
                 }
                    <div>
                        <span className='sub-title'>Open Tasks</span>
                        <div className='count-container'>
                        <span className='counting'>2</span>
                        </div>
                    </div>
                    {currentProject.project_status == statusMap.inProgress.key &&
                    <div className='working-time'>
                        <div className='clock'>
                            <FontAwesomeIcon className='icon' icon={faStopwatch} size={'1x'}/>
                            <h4 className='working-title'>Working time</h4>
                            <Timer className='timer' startingTime={workRef.current.start_time} run={isWorking}/>
                        </div>
                    <CrmButton content={isWorking ? 'Stop' : 'Start'} buttonClass='main-button' isLoading={false} callback={isWorking ? stoptWork : startWork}/>
                    </div>}
                </div>
                <div className='sub-details'>
                <span>Due on: {currentProject.deadline}</span>
                </div>
                <div className='main-project-content'>
                    <div className='first-group'>
                        <div>
                            <div className='action-title'>                    
                                <h4>Description</h4>
                                <FontAwesomeIcon className='button-icon' onClick={()=>{setIsEditDescription(true)}} icon={faEdit} size={'1x'}/>
                            </div>
                        {isEditDescription ? 
                        <div className='description-edit'> 
                        <textarea rows='8' onChange={((e)=>{tempDescription = e.target.value})} defaultValue={currentProject.description}></textarea> 
                        <CrmButton content={'Save'} buttonClass='secondary-button' containerClass= {'form-action'} callback={()=> {submitUpdateDescription(tempDescription)}}/>
                        </div>
                        : <div>{currentProject.description}</div>}
                        </div>
                        <div className='tasks'>
                        <div className='action-title'>
                        <h4>Tasks</h4>
                        <FontAwesomeIcon onClick={()=>{setAddTask(true)}} className='button-icon' icon={faPlus} size={'lg'}/>
                        </div>
                        {addTask && 
                        <div className='task-edit'> 
                            <input type='text' onChange={(e)=>{newTaskDescription=e.target.value}}/>
                            <FontAwesomeIcon  onClick={()=>{handleAddTask()}} className='button-icon ok-icon' icon={faCheckCircle} size={'2x'}/>
                            <FontAwesomeIcon  onClick={()=>{setAddTask(false)}} className='button-icon cancel-icon' icon={faTimesCircle} size={'2x'}/>
                        </div>}
                        <DndProvider backend={HTML5Backend}>
                            <DragDrop tasks={tasks}/>
                        </DndProvider>
                        </div>
                    </div>
                    <div className='second-group'>
                        <div>
                            <h4>Client</h4>
                            <span>{currentProject.client_name}</span>
                            <span><a href={`mailto:${currentProject.client_mail}`}>{currentProject.client_mail}</a></span>
                            <span><a href={`tel:${currentProject.client_phone}`}>{currentProject.client_phone}</a></span>
                        </div>
                        <div>
                            <h4>Assigned Teammate</h4>
                            <div>
                            <FontAwesomeIcon className='icon' icon={faUserCircle} size={'lg'}/>
                            <span>{currentProject.user_name}</span>
                            </div>
                        </div>
                        <div>
                        <div className='action-title'>
                        <h4>Attachments</h4>
                        <input type='file'  accept="image/png, image/jpeg"  onChange={onFileChange} id='file' ref={inputFile} style={{display: 'none'}}/>
                        <FontAwesomeIcon  onClick={attachClick} className='button-icon' icon={faPaperclip} size={'lg'}/>
                        </div>
                        <div className='imgs-container'>
                        {imgList.length > 0 && getImgs()}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
        </div>
    );
}

export default ProjectPage;