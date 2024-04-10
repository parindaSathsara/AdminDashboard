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

// import { cibFacebook, cibLinkedin, cibTwitter, cilCalendar } from '@coreui/icons'

const textColor = {
  color: 'white'
}

const messageList = [
  { id: 1, text: 'Hi', role: 'Admin' },
  { id: 2, text: 'Hi', role: 'Supplier' },
  { id: 3, text: 'Hi', role: 'Customer' },
  { id: 4, text: 'What the reson', role: 'Admin' },
  { id: 5, text: 'How are You', role: 'Admin' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 6, text: 'How are You', role: 'Customer' },
  { id: 4, text: 'What the reson', role: 'Admin' },
  { id: 4, text: 'What the reson', role: 'Admin' },
  { id: 4, text: 'What the reson', role: 'Admin' },
  { id: 4, text: 'What the reson', role: 'Admin' },
  { id: 4, text: 'What the reson', role: 'Admin' },
];

const MessageList = (props) => {

  const messageContailerRef = useRef(null);

  useEffect(() => {
    if (messageContailerRef.current) {
      messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight;
    }
  }, []);

  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const sendMessage = () => {
    setMessage('')

  }

  return (
    <div className='message-list'>
      <CRow className='message-list-header-bar p-3'>
        <CCol sm={1}>
          <CAvatar color="primary" textColor="white" size="m">UM</CAvatar>
        </CCol>
        <CCol style={textColor} className='d-flex align-items-center' sm={9}>
          {props.conversation && props.conversation.name}
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
