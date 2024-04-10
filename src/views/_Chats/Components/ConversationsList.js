import React, { useState } from 'react';
import './ConversationsList.css';
import { CRow, CCol, CFormInput, CListGroup, CListGroupItem, CButtonGroup, CButton } from '@coreui/react';
import Conversation from './Conversation';
import { id } from 'date-fns/locale';


const ConversationsList = (props) => {

  const privateConversations = [
    { id: 1, name: "Umayanga" },
    { id: 2, name: "Vidunuwan" },
    { id: 3, name: "Kamala" },
    { id: 4, name: "Nimal" },
    { id: 5, name: "Sunil" },
    { id: 6, name: "Sunil" },
    { id: 7, name: "Sunil" },
  ]
  const groupConversations = [
    { id: 1, name: "KOs Kola" },
    { id: 2, name: "Ranctrips" },
    { id: 3, name: "ODela" },
  ]

  const [conversationType, setConversationType] = useState('private');


  const sendActivateConversation = (conversation) => {
    props.sendActivateConversation(conversation);
  };

  return (
    <div className='user-list'>
      <div className='search'>
        <CFormInput type="text" className='search-input' placeholder="Search" />
      </div>
      <CRow className='p-3'>
        <CCol className={`d-flex justify-content-center align-items-center custom-button ${conversationType === "private" ? "custom-button-active" : ""}`} onClick={() => { setConversationType('private') }}>Private</CCol>
        <CCol className={`d-flex justify-content-center align-items-center custom-button ${conversationType === "group" ? "custom-button-active" : ""}`} onClick={() => { setConversationType('group') }}>Group</CCol>
      </CRow>

      <CListGroup className='chat-group'>
        {conversationType === "private" && privateConversations.map((conversation, index) => (
          <Conversation key={index} name={conversation.name} onClick={() => sendActivateConversation(conversation)} />
        ))}
        {conversationType === "group" && groupConversations.map((conversation, index) => (
          <Conversation key={index} name={conversation.name} onClick={() => sendActivateConversation(conversation)} />
        ))}
      </CListGroup>
    </div >
  )
}

export default ConversationsList
