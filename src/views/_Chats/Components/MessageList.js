import React from 'react';
import './MessageList.css';
import { CNavbar, CContainer, CNavbarBrand, CAvatar, CRow, CCol, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons';
import { cibBabel } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faUserPlus, faUserMinus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// import { cibFacebook, cibLinkedin, cibTwitter, cilCalendar } from '@coreui/icons'

const textColor = {
  color: 'white'
}

const MessageList = () => {
  return (
    <div className='message-list'>
      <CRow className='message-list-header-bar p-3'>
        <CCol sm={1}>
          <CAvatar color="primary" textColor="white" size="m">UM</CAvatar>
        </CCol>
        <CCol style={textColor} className='d-flex align-items-center' sm={9}>
          Umayanga Vidunuwan
        </CCol>
        <CCol className='d-flex justify-content-between align-items-center' style={textColor} sm={2}>
          <FontAwesomeIcon icon={faUserPlus} />
          <FontAwesomeIcon icon={faUserMinus} />
          <FontAwesomeIcon icon={faInfo} />
        </CCol>
      </CRow>
      <CContainer>
      </CContainer>
      <CRow className='mt-auto p-2' style={textColor}>
        <CCol sm={11}>
          <CFormInput type="text" placeholder="Type a message" aria-label="default input example" />
        </CCol>
        <CCol sm={1} style={{ padding: 0 }}>
          <CButton color="light"><FontAwesomeIcon icon={faPaperPlane} /></CButton>
        </CCol>
      </CRow>
    </div >
  )
}
export default MessageList
