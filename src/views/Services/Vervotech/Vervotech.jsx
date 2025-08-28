import { CRow, CCol, CCard } from '@coreui/react'
import VervotechTabs from './VervotechTabs'

const Vervotech = () => {
  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="p-3">
          <VervotechTabs />
          <h2 className="mb-0">Vervotech</h2>
          <p className="text-muted">Overview placeholder. Choose a tab to continue.</p>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Vervotech
