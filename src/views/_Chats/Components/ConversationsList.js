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

  const [searchText, setSearchText] = useState('');

  const filterConversations = (conversations) => {
    return conversations.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  }

  return (

    <div className='user-list'>
      <div className='search'>
        <CFormInput type="text" className='search-input' placeholder="Search" onChange={handleSearch} />
      </div>
      <CRow className='p-3'>
        <CCol className={`d-flex justify-content-center align-items-center custom-button ${conversationType === "private" ? "custom-button-active" : ""}`} onClick={() => { setConversationType('private') }}>Private</CCol>
        <CCol className={`d-flex justify-content-center align-items-center custom-button ${conversationType === "group" ? "custom-button-active" : ""}`} onClick={() => { setConversationType('group') }}>Group</CCol>
      </CRow>

      <CListGroup className='chat-group'>
        {conversationType === "private" && filterConversations(privateConversations).map((conversation, index) => (
          <Conversation activatedConversation={props.activatedConversation} key={index} id={conversation.id} name={conversation.name} onClick={() => sendActivateConversation(conversation)} />
        ))}
        {conversationType === "group" && filterConversations(groupConversations).map((conversation, index) => (
          <Conversation activatedConversation={props.activatedConversation} key={index} id={conversation.id} name={conversation.name} onClick={() => sendActivateConversation(conversation)} />
        ))}
      </CListGroup>
    </div >
  )
}

export default ConversationsList
