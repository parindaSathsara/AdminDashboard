import React from 'react';
import './Conversation.css';
import { CRow, CCol, CAvatar, CCardText } from '@coreui/react';


const Conversation = (props) => {
  return (
    <div onClick={props.onClick}>
      <CRow className='chat-user d-flex align-items-center'>
        <CCol sm={3} className='text-center'>
          <CAvatar color="primary" textColor="white" size="lg">AV</CAvatar>
        </CCol>
        <CCol sm={9}>
          <CCardText>{props.name}</CCardText>
        </CCol>
      </CRow>
    </div>
  )
}

export default Conversation
