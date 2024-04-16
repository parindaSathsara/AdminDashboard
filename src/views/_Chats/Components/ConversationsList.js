import React, { useEffect, useState } from 'react';
import './ConversationsList.css';
import { CRow, CCol, CFormInput, CListGroup, CListGroupItem, CButtonGroup, CButton } from '@coreui/react';
import Conversation from './Conversation';
import { auth, db } from 'src/firebase';
import axios from 'axios';


const ConversationsList = (props) => {

  const [privateConversations, setprivateConversations] = useState([]);
  const [groupConversations, setgroupConversations] = useState([]);

  const [conversationType, setConversationType] = useState('group');

  const handleActivateConversation = (conversation) => {
    props.sendActivateConversation(conversation);
  };

  const [searchText, setSearchText] = useState('');

  const filterConversations = (conversations) => {
    return conversations.filter(item => item.chat_name.toLowerCase().includes(searchText.toLowerCase()));
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  }

  const fetchConversations = async () => {
    var baseURL = "https://gateway.aahaas.com/api";

    try {
      axios.get(baseURL + '/getchats').then(response => {
        if (response.status == 200) {
          const conversations = response.data.data;

          conversations.sort(function (a, b) {
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);
            return dateB - dateA;
          });
          setgroupConversations(conversations);
        }
      })
    }
    catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    fetchConversations();
  }, [])

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
          <Conversation activatedConversation={props.activatedConversation} key={index} chat_data={conversation} onClick={() => handleActivateConversation(conversation)} />
        ))}
        {conversationType === "group" && filterConversations(groupConversations).map((conversation, index) => (
          <Conversation activatedConversation={props.activatedConversation} key={index} chat_data={conversation} onClick={() => handleActivateConversation(conversation)} />
        ))}
      </CListGroup>

    </div >
  )
}
export default ConversationsList;
