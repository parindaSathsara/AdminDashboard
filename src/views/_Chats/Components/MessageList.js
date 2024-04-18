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
import { text } from '@fortawesome/fontawesome-svg-core';
import MessageListDetails from './MessageListDetails';
import AddUserModel from './AddUserModel';
import axios from 'axios';
import Swal from 'sweetalert2';

const textColor = {
  color: 'white'
}

const MessageList = (props) => {

  var baseURL = "https://gateway.aahaas.com/api";


  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState('');
  const [collection_id, setCollection_id] = useState(null);
  const [isMessageDelete, setIsMessageDelete] = useState(false);
  const [isMessageEdit, setisMessageEdit] = useState(false);
  const [detailsModelVisibility, setdetailsModelVisibility] = useState(false);
  const [addUserModelVisibility, serAddUserModelVisibility] = useState(false);


  const messageContailerRef = useRef(null);

  const handleMessageEditStatus = (status) => {
    setisMessageEdit(status);
  }

  const updateMessageDeleteStatus = () => {
    setIsMessageDelete(true);
  }

  const handleMessageDetailsvisibility = (visibility) => {
    setdetailsModelVisibility(visibility);
  }

  const handleAddUservisibility = (visibility) => {
    serAddUserModelVisibility(visibility);
  }


  const scrollDown = () => {
    if (!(isMessageDelete || isMessageEdit) && messageContailerRef.current) {
      messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight;
    }
    setIsMessageDelete(false);
    setisMessageEdit(false);
  }

  useEffect(() => {
    if (props.conversation_data) {
      fetchMessages(props.conversation_data.customer_collection_id);
      setCollection_id(props.conversation_data.customer_collection_id);
    }
  }, [props.conversation_data]);


  useEffect(() => {
    scrollDown();
  }, [messageList]);


  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const sendMessage = async () => {
    if (message.trim() == "") {
      return
    }
    await addDoc(collection(db, "chats/chats_dats/" + collection_id), {
      text: message,
      name: "Admin",
      avatar: '',
      createdAt: serverTimestamp(),
      role: "Admin",
      readAt: null,
      uid: "admin"
    })
    setMessage('')
  }

  const sendMessageByEnter = (event) => {
    if (event.keyCode === 13) {
      sendMessage();
    }
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

  const removeSupplier = () => {

    Swal.fire({
      title: "Are you sure?",
      text: "Remove supplier from this chat",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!"
    }).then((result) => {
      if (result.isConfirmed) {

        const dataSet = props.conversation_data;

        // dataSet.supplier_id = null;
        // dataSet.supplier_name = null;
        // dataSet.group_chat = false;
        // dataSet.private_chat = true;
        // dataSet.supplier_mail_id = null;
        dataSet.supplier_removed_date = new Date();

        try {
          axios.post(baseURL + '/updatechat/' + props.conversation_data.chat_id, dataSet).then(res => {
            if (res.data.status === 200) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Supplier Removed",
                showConfirmButton: false,
                timer: 1500
              });
            } else {

            }
          })
        } catch (error) {
          console.log(error);
          throw new Error(error)
        }
      }
    });
  }

  return (
    <div className='message-list'>
      {props.conversation_data ? (
        <>
          <CRow className='message-list-header-bar p-3'>
            <CCol sm={1}>
              {props.conversation_data && (props.conversation_data.chat_avatar ? (
                <CContainer className='avatar-cover' style={{ width: '40px', height: '40px' }}>
                  <img className='chat-avatar' src={props.conversation_data.chat_avatar} alt='Avatar' />
                </CContainer>
              ) : (
                <CAvatar color="primary" textColor="white" size='lg'>{props.conversation_data.chat_name ? (props.conversation_data.chat_name.toUpperCase().slice(0, 2)) : ''}</CAvatar>
              ))}
            </CCol>
            <CCol style={textColor} className='d-flex align-items-center' sm={9}>
              {props.conversation_data && props.conversation_data.chat_name}
            </CCol>
            <CCol className='d-flex justify-content-end align-items-center' style={textColor} sm={2}>
              {!props.conversation_data.supplier_removed_date ? (
                <FontAwesomeIcon icon={faUserMinus} className='m-2' onClick={removeSupplier} />
              ) : (
                <FontAwesomeIcon icon={faUserPlus} className='m-2' onClick={() => handleAddUservisibility(true)} />
              )}
              <FontAwesomeIcon icon={faInfo} onClick={() => handleMessageDetailsvisibility(true)} className='m-1' />
            </CCol>
          </CRow>

          <CContainer className='mt-auto message-container' ref={messageContailerRef}>
            {messageList.map((messageData, index) => (
              <Message key={index} messageData={messageData} handleEditStatus={handleMessageEditStatus} conversation_id={props.conversation_data.customer_collection_id} updateMessageDeleteStatus={updateMessageDeleteStatus} ></Message>
            ))}
          </CContainer>

          <CRow className='p-2' style={textColor}>
            <CCol sm={11}>
              <CFormInput type="text" placeholder="Type a message" onChange={handleMessageChange} value={message} onKeyDown={(event) => sendMessageByEnter(event)} />
            </CCol>
            <CCol sm={1} style={{ padding: 0 }}>
              <CButton color="light"><FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage} /></CButton>
            </CCol>
          </CRow>

          <MessageListDetails conversation_data={props.conversation_data} visibility={detailsModelVisibility} handleVisibility={handleMessageDetailsvisibility}></MessageListDetails>
          <AddUserModel conversation_data={props.conversation_data} visibility={addUserModelVisibility} handleVisibility={handleAddUservisibility} ></AddUserModel>

        </>) : (
        <div className='d-flex align-items-center justify-content-center' style={{ height: '100%' }}>
          <h4 style={{ color: "gray" }}>Please Select any Conversation</h4>
        </div>)}
    </div >
  )
}
export default MessageList
