import React, { useState } from 'react';
import './ChatsIndex.css';
import ConversationsList from './Components/ConversationsList';
import MessageList from './Components/MessageList';
import { CRow, CCol } from '@coreui/react';

const ChatsIndex = () => {

  const [activatedConversation, setActivatedConversation] = useState(null);

  const receiveActivateConversation = (conversation) => {
    setActivatedConversation(conversation);
  }

  return (
    <div className='chat-index'>
      <CRow>
        <CCol xs={4}>
          <ConversationsList activatedConversation={activatedConversation} sendActivateConversation={receiveActivateConversation}></ConversationsList>
        </CCol>
        <CCol xs={8}>
          <MessageList conversation={activatedConversation}></MessageList>
        </CCol>
      </CRow>
    </div>
  )
}
export default ChatsIndex
