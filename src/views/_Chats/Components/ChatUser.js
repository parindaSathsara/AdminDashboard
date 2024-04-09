import React from 'react';
import './ChatUser.css';
import {CRow,CCol,CAvatar} from '@coreui/react';


const ChatUser = () => {
  return (
    <div className='chat-user'>
      <CRow>
        <CCol xs={4}>
          <CAvatar color="primary" textColor="white" size="lg">UM</CAvatar>
        </CCol>
        <CCol className='align-self-center' xs={8}>
          Umayanga
        </CCol>
      </CRow>
    </div>
  )
}

export default ChatUser
