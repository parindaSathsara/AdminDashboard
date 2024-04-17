import React from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton } from '@coreui/react';


const MessageListDetails = (props) => {
  console.log(props.conversation_data);
  return (
    <div>
      <CModal
        visible={props.visibility}
        onClose={() => props.handleVisibility(false)}
      >
        <CModalHeader onClose={() => props.handleVisibility(false)} className='message-details-model'>
          <CModalTitle>{props.conversation_data && props.conversation_data.chat_name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Woohoo, you're reading this text in a modal!</p>
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
