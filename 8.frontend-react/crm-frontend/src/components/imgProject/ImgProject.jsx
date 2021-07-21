import React, {useState} from 'react';
import './imgProject.scss'
import Modal from 'react-modal';

function ImgProject(props) {

    const [isImgModalOpen, setIsImgModalOpen] = useState(false);

    const handelImgClick = (img) => {
        
    }

    const openShowImg = ()=>{
        setIsImgModalOpen(true);
      };
  
      const closeShowImg= ()=>{
          setIsImgModalOpen(false);
      };

    return (
        <span>
            <img className='project-img' onClick={openShowImg} src={props.imgPath}/>
            <Modal isOpen={isImgModalOpen} ariaHideApp={false} contentLabel='ImgShow' onRequestClose={closeShowImg}  overlayClassName="Overlay" className='img-modal'>
                <div className='img-wrapper'>
                <img className='img-show' onClick={openShowImg} src={props.imgPath}/>
                </div>
            </Modal>
        </span>
    );
}

export default ImgProject;