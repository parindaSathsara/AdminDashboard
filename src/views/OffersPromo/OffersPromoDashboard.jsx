import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'
import MainDiscounts from './Components/MainDiscounts'


const OffersPromoDashboard = () => {
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Promotions & Offers</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-body-secondary small">
                            Maximizing Customer Engagement through Strategic Promotion & Offer Management
                        </p>

                        <MainDiscounts></MainDiscounts>

                    </CCardBody>
                </CCard>
            </CCol>

        </CRow>
    )
}

export default OffersPromoDashboard
