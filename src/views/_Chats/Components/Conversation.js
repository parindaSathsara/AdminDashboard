import React from 'react';
import './Conversation.css';
import { CRow, CCol, CAvatar, CCardText, CContainer } from '@coreui/react';


const Conversation = (props) => {

  return (
    <div onClick={props.onClick}>
      <CRow className={`chat-user d-flex align-items-center ${props.activatedConversation && (props.activatedConversation.chat_id == props.chat_data.chat_id ? 'chat-user-active' : '')}`}>
        <CCol sm={3} className='text-center'>
          {props.chat_data.chat_avatar ? (
            <CContainer className='avatar-cover'>
              <img className='chat-avatar' src={props.chat_data.chat_avatar} alt='Avatar' />
            </CContainer>
          ) : (
            <CAvatar color="primary" textColor="white" size='lg'>{props.chat_data.chat_name ? (props.chat_data.chat_name.toUpperCase().slice(0, 2)) : ''}</CAvatar>
          )}
        </CCol>
        <CCol sm={9}>
          <CCardText>{props.chat_data.chat_name}</CCardText>
        </CCol>
      </CRow>
    </div >
  )
}

export default Conversation
