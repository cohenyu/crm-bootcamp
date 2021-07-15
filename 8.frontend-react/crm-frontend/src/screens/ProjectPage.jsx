import React, {useEffect, useState, useRef} from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import { Link, useHistory, useParams } from 'react-router-dom';
import CrmApi from '../helpers/CrmApi';
import Timer from '../components/timer/Timer';
import CrmButton from '../components/crmButton/CrmButton';
import '../styles/projectPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faStopwatch, faUserCircle, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import statusMap from '../helpers/StatusMap';
import ImgProject from '../components/imgProject/ImgProject';


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

    useEffect(() => {
        (async () => {
            const result = await crmApi.getProject(projectId);
            if(result){
                console.log(result);
                setCurrentProject(result);
                calculateDays(result.deadline);
            } else {
                history.push('/home');
                // send to home or projects
            }
        })();


        // (async () => {
        //     const result = await crmApi.getWorkingTime({projectId: projectId});
        //     if(result){
        //         let $openWork  = result.works.filter((workingTime)=>{
        //             return workingTime.stop_time == null;
        //         })
                
        //         if($openWork.length == 1) {
        //             setCurrentWork($openWork[0]);
        //             setIsWorking(true);
        //             setWorkId($openWork[0].work_id);
        //         }
        //         console.log("total: ", result);
        //         setTotalHours(result.total);
        //     } else {
        //         // TODO error
        //     }
        // })();

    }, [])

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
                console.log("total: ", result);
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
                console.log(result);
                setImgList(result);
                // setImgList(result.map((item)=>{
                //     console.log(item.img_url);
                //     return item.img_url;
                // }))
            } else {
                // TODO error
            }
        })();
    }, [imgUploaded]);
    

    const startWork = async () => {
        setCurrentWork({});
        console.log("start");
        const result = await crmApi.startWorkingTime({projectId: projectId});
        if(result){
            setWorkId(result);
            setIsWorking(true);
            console.log(result);
        } else {
            // send to home or projects
        }
    }

    const stoptWork = async () => {
        console.log("stop");
        const result = await crmApi.stopWorkingTime({workId: workId});
        if(result){
            setIsWorking(false);
            console.log(result);
        } else {
            // send to home or projects
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
            for(let imgItem of imgList){
                const path = `http://localhost:9991/imgs/${imgItem.img_url}`;
                imgs.push(<ImgProject imgPath={path} clickHandle={()=>{}} key={imgItem.img_url}/>)
            }
        }
        return imgs;
    }

    return (
        <div>
            <Header/>
            {currentProject && 
            <div className='crm-page project-page'>
                <div className='project-header'>
                    <h1>{currentProject.item_type.charAt(0).toUpperCase() + currentProject.item_type.slice(1).toLowerCase()} </h1>
                    <h5>{`Total ${+(totalHours/60).toFixed(2)} Working Hours`}</h5>
                    <span> {currentProject.project_status}</span>
                </div>
                <div className='quick-view'>
             
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
                    <div className='working-time'>
                        <div className='clock'>
                            <FontAwesomeIcon className='button-icon' icon={faStopwatch} size={'1x'}/>
                            <h4 className='working-title'>Working time</h4>
                            <Timer className='timer' startingTime={workRef.current.start_time} run={isWorking}/>
                        </div>
                    <CrmButton content={isWorking ? 'Stop' : 'Start'} buttonClass='main-button' isLoading={false} callback={isWorking ? stoptWork : startWork}/>
                    </div>
                </div>
                <div className='sub-details'>
                <span>Due on: {currentProject.deadline}</span>
                </div>
                <div className='main-project-content'>
                    <div className='first-group'>
                        <div>
                        <h4>Description</h4>
                        {currentProject.description}
                        </div>
                        <div>
                        <h4>Tasks</h4>
                        bla bla bla
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
                            <FontAwesomeIcon className='button-icon' icon={faUserCircle} size={'lg'}/>
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
    );
}

export default ProjectPage;