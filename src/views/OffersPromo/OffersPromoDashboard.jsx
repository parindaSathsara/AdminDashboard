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
import CouponPromotions from './Components/CouponPromotions'
import ProductPromotions from './Components/ProductPromotions'


const OffersPromoDashboard = () => {
    return (
        <CCol xs={12}>
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
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Coupon Promotions</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p className="text-body-secondary small">
                                Create limited-time discount coupons for selected products
                            </p>

                            <CouponPromotions></CouponPromotions>

                        </CCardBody>
                    </CCard>
                </CCol>


                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Product Promotions</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p className="text-body-secondary small">
                                Manage promotional campaigns for various product lines
                            </p>

                            <ProductPromotions></ProductPromotions>

                        </CCardBody>
                    </CCard>
                </CCol>

            </CRow>
        </CCol>
    )
}

export default OffersPromoDashboard
