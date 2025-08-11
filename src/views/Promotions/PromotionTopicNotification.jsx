import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import { Box, Typography, LinearProgress } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'
function PromotionTopicNotification() {
  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h3 className="fw-bold mb-2">Send Notifications</h3>
      </CCardBody>
    </CCard>
  )
}
export default PromotionTopicNotification
