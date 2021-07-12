
import './actionModal.scss'
import Modal from 'react-modal';
import CrmButton from '../crmButton/CrmButton';
import React, {useState, useMemo, useEffect, useRef} from 'react';

const ActionModal = (props) => {
  
  return (
    <Modal isOpen={props.isOpen} ariaHideApp={false} contentLabel='action' onRequestClose={props.onClose}  overlayClassName="Overlay" className='modal'>
        <h2>{props.title}</h2>
        <div className='action-buttons-modal'>
        <CrmButton content={props.ok} buttonClass='main-button' isLoading={props.isLoading} callback={()=> props.action()}/>
        <CrmButton content={props.cancel} buttonClass='secondary-button' isLoading={props.isLoading} callback={()=> props.onClose()}/>
        </div>
    </Modal>
  );
}

export default ActionModal