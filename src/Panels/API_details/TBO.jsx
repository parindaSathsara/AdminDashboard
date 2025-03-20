import {
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const TBO = () => {
  const [tboDetails, setTboDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTboDetails()
  }, [])

  const fetchTboDetails = async () => {
    try {
      const res = await axios.get('/tbov2/getAgencyBalance')
      setTboDetails(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching details:', err)
    }
  }

  return (
    <CContainer className="py-4">
      <h2 className="mb-4 text-dark">Agency Balance</h2>
      <CRow className="justify-content-center">
        <CCol xs={12} md={8} lg={6}>
          <CCard className="shadow-sm border-0">
            <CCardBody className="p-4">
              <CCardTitle className="mb-4 text-center h3">Financial Details</CCardTitle>

              {loading ? (
                <div className="text-center p-3">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <>
                  <CCardText className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold">Cash Balance:</span>
                    <span className="badge bg-success fs-6">
                      {tboDetails?.CashBalance} {tboDetails?.CashBalanceInPrefCurrency || 'USD'}
                    </span>
                  </CCardText>
                  <CCardText className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Credit Balance:</span>
                    <span className="badge bg-info fs-6">
                      {tboDetails?.CreditBalance} {tboDetails?.CreditBalanceInPrefCurrency || 'USD'}
                    </span>
                  </CCardText>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default TBO
