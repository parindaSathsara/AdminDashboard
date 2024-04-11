import React from 'react'
import { CAvatar, CCol, CRow } from '@coreui/react';
import './Message.css'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Message = (props) => {
  return (
    <div className='p-1'>
      <CRow className={`${props.messageData && props.messageData.role != 'Admin' ? 'flex-row-reverse' : ''}`}>
        <CCol sm={1} className='text-center'>
          <CAvatar color="primary" textColor="white" size="m">AV</CAvatar>
        </CCol>
        <CCol className={`d-flex align-items-center ${props.messageData.role}`}>
          <div className='message-content'>
            {props.messageData.text}
          </div>
          <FontAwesomeIcon className='fa-icons' icon={faEdit} />
          <FontAwesomeIcon className='fa-icons' icon={faTrash} />
        </CCol>
      </CRow>
    </div >
  )
}

export default Message
