import React, { useEffect, useRef, useState } from 'react';
import './MessageList.css';
import { CNavbar, CContainer, CNavbarBrand, CAvatar, CRow, CCol, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons';
import { cibBabel } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faUserPlus, faUserMinus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Message from './Message';
import { event } from 'jquery';
import { db } from 'src/firebase';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

const textColor = {
  color: 'white'
}

const MessageList = (props) => {

  const [messageList, setMessageList] = useState([]);

  const messageContailerRef = useRef(null);

  const scrollDown = () => {
    if (messageContailerRef.current) {
      messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    if (props.conversation_data) {
      fetchMessages(props.conversation_data.customer_collection_id);
    }
  }, [props.conversation_data]);


  useEffect(() => {
    scrollDown();
  }, [messageList]);

  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const sendMessage = () => {
    setMessage('')
  }

  const fetchMessages = (id) => {
    const q = query(collection(db, "chats/chats_dats/" + id), orderBy("createdAt", "asc"), limit(50))
    const getMessages = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = [];
      querySnapshot.forEach(doc => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      setMessageList(fetchedMessages);
    })
  }

  return (
    <div className='message-list'>
      <CRow className='message-list-header-bar p-3'>
        <CCol sm={1}>
          <CAvatar color="primary" textColor="white" size="m">UM</CAvatar>
        </CCol>
        <CCol style={textColor} className='d-flex align-items-center' sm={9}>
          {props.conversation_data && props.conversation_data.chat_name}
        </CCol>
        <CCol className='d-flex justify-content-between align-items-center' style={textColor} sm={2}>
          <FontAwesomeIcon icon={faUserPlus} />
          <FontAwesomeIcon icon={faUserMinus} />
          <FontAwesomeIcon icon={faInfo} />
        </CCol>
      </CRow>

      <CContainer className='mt-auto message-container' ref={messageContailerRef}>
        {messageList.map((messageData, index) => (
          <Message key={index} messageData={messageData} ></Message>
        ))}
      </CContainer>

      <CRow className='p-2' style={textColor}>
        <CCol sm={11}>
          <CFormInput type="text" placeholder="Type a message" onChange={handleMessageChange} value={message} />
        </CCol>
        <CCol sm={1} style={{ padding: 0 }}>
          <CButton color="light"><FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage} /></CButton>
        </CCol>
      </CRow>
    </div >
  )
}
export default MessageList
