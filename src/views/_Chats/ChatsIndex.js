import React from 'react';
import './ChatsIndex.css';
import UserList from './Components/UserList';
import MessageList from './Components/MessageList';
import {CRow,CCol} from '@coreui/react';

const ChatsIndex = () => {
  return (
    <div className='chat-index'>
      <CRow>
        <CCol xs={3}>
          <UserList></UserList>
        </CCol>
        <CCol xs={9}>
        <MessageList></MessageList>
        </CCol>
      </CRow>
    </div>
  )
}
export default ChatsIndex
