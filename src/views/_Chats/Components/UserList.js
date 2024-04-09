import React from 'react';
import './UserList.css';
import {CRow,CCol,CFormInput,CListGroup,CListGroupItem,CButtonGroup,CButton} from '@coreui/react';
import ChatUser from './ChatUser';


const UserList = () => {
  return (
      <div className='user-list'>
        <div className='search'>
          <CFormInput type="text" className='search-input' placeholder="Search"/>
        </div>
        <CRow className='p-3'>
          <CCol className='d-flex justify-content-center align-items-center custom-button custom-button-active'>Private</CCol>
          <CCol className='d-flex justify-content-center align-items-center custom-button'>Group</CCol>
        </CRow>
        <CListGroup className='chat-group'>
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
            <ChatUser />
        </CListGroup>
      </div>
  )
}

export default UserList
