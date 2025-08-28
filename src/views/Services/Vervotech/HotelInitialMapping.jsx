import React from 'react'
import { CRow, CCol, CCard } from '@coreui/react'
import VervotechTabs from './VervotechTabs'

const HotelInitialMapping = () => {
  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="p-3">
          <VervotechTabs />
          <h2 className="mb-0">Hotel Initial Mapping Sync</h2>
          <p className="text-muted">Layout placeholder. Implement logic later.</p>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HotelInitialMapping
