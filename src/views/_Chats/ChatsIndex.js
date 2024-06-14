import React, { useState } from 'react';
import './ChatsIndex.css';
import ConversationsList from './Components/ConversationsList';
import MessageList from './Components/MessageList';
import { CRow, CCol } from '@coreui/react';
import ChatMain from './ChatMain/ChatMain';

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
          <MessageList conversation_data={activatedConversation}></MessageList>
        </CCol>
      </CRow>

      {/* <ChatMain></ChatMain> */}
    </div>
  )
}
export default ChatsIndex
