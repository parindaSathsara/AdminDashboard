import React, { useState } from 'react'
import { CAvatar, CCol, CRow } from '@coreui/react';
import './Message.css'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/firebase';


const Message = (props) => {

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
  return (
    <div className='p-1'>
      <CRow className={`message-main ${props.messageData && props.messageData.role != 'Admin' ? 'flex-row-reverse' : ''}`}>
        <CCol sm={1} className='text-center'>
          <CAvatar color="primary" textColor="white" size="m">AV</CAvatar>
        </CCol>
        <CCol className={`d-flex align-items-center ${props.messageData.role}`}>
          <div className='message-content'>
            {props.messageData.text}
          </div>
          <FontAwesomeIcon className='fa-icons' icon={faEdit} />
          <FontAwesomeIcon className='fa-icons' icon={faTrash} onClick={deleteMessage} />
        </CCol>
      </CRow>
    </div >
  )
}

export default Message
