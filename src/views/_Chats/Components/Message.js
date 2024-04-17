import React, { useEffect, useState } from 'react'
import { CAvatar, CCol, CFormInput, CRow } from '@coreui/react';
import './Message.css'
import { faEdit, faTrash, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase';


const Message = (props) => {

  const [editMessage, setEditMessage] = useState(null);
  const [editText, setEditText] = useState('');

  // const time = props.messageData.createdAt.seconds * 1000 + Math.round(props.messageData.createdAt.seconds / 1000000);
  // const date = new Date(time).toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit' });

  const deleteMessage = async () => {
    props.updateMessageDeleteStatus();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "chats/chats_dats/" + props.conversation_id, props.messageData.id))
        // Swal.fire({
        //   title: "Deleted!",
        //   text: "Message has been deleted.",
        //   icon: "success"
        // });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }

  }
  const handleMessageEdit = (message) => {
    setEditMessage(message);
    setEditText(message.text);
  }

  const handleEditText = (e) => {
    setEditText(e.target.value)
  }

  const cancelEditMessage = () => {
    setEditMessage(null);
  }

  const updateMessage = async () => {

    props.handleEditStatus(true);
    if (editText.trim() == "") {
      return;
    }

    try {
      await updateDoc(doc(db, "chats/chats_dats/" + props.conversation_id, props.messageData.id), {
        text: editText,
        editedAt: serverTimestamp(),
        editedBy: 'Admin'
      })
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    setEditMessage(null);
    props.handleEditStatus(true);
  }

  const updateMessageByEnter = (event) => {
    if (event.keyCode === 13) {
      updateMessage();
    }
  }

  return (
    <div className='p-1'>
      <CRow className={`message-main ${props.messageData && props.messageData.role != 'Admin' ? 'flex-row-reverse' : ''}`}>
        <CCol sm={1} className='text-center'>
          <CAvatar color="primary" textColor="white" size="m">AV</CAvatar>
        </CCol>
        <CCol sm={11} className={`d-flex align-items-center ${props.messageData.role}`}>
          {(editMessage && editMessage.id == props.messageData.id) ? (
            <CFormInput className='message-content' value={editText} onChange={() => handleEditText(event)} onKeyDown={updateMessageByEnter}></CFormInput>
          ) : (
            <div className='message-content'>
              {props.messageData.text}
            </div>
          )}

          {(editMessage && editMessage.id == props.messageData.id) ? (
            <div style={{ background: 'transparent', display: 'flex', alignItems: 'center' }} >
              <FontAwesomeIcon className='fa-icons m-1' icon={faSave} onClick={updateMessage} />
              <FontAwesomeIcon className='fa-icons ' icon={faTimesCircle} onClick={cancelEditMessage} />
            </div>
          ) : (
            <div style={{ background: 'transparent' }}>
              <FontAwesomeIcon className='fa-icons' icon={faEdit} onClick={() => handleMessageEdit(props.messageData)} />
              <FontAwesomeIcon className='fa-icons' icon={faTrash} onClick={deleteMessage} />
            </div>
          )}
        </CCol>
        <CCol sm={1}>
        </CCol>
        <CCol sm={11}>
          <div className={`message-details message-details-${props.messageData.role}`}>
            {/* {date + " "} */}
            {props.messageData.editedAt ? ("Edited by " + props.messageData.editedBy) : ''}
          </div>
        </CCol>
      </CRow>
    </div >
  )
}

export default Message
