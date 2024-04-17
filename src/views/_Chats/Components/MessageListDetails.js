import React from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton } from '@coreui/react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MessageListDetails = (props) => {
  return (
    <div>
      <CModal
        visible={props.visibility}
        onClose={() => props.handleVisibility(false)}
      >
        <CModalHeader onClose={() => props.handleVisibility(false)} className='message-details-model'>

          <CModalTitle className='d-flex align-items-center'> <FontAwesomeIcon icon={faInfoCircle} className='m-2' /> <div>{props.conversation_data && props.conversation_data.chat_name}</div></CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><b>Chat created : </b>{props.conversation_data.created_at}</p>
          <p><b>Chat type : </b>{props.conversation_data.group_chat ? 'Group Chat' : 'Private Chat'}</p>
          <p><b>Supplier added date : </b> {props.conversation_data.supplier_added_date}</p>
          <p><b>Supplier mail id : </b> {props.conversation_data.supplier_mail_id}</p>
          <p><b>Supplier name : </b>{props.conversation_data.supplier_name}</p>
          <p><b>Customer mail id : </b>{props.conversation_data.customer_mail_id}</p>
          <p><b>Query status : </b>{props.conversation_data.status}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => props.handleVisibility(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default MessageListDetails
