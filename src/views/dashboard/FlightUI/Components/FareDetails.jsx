import { CContainer, CCard, CCardBody, CCardTitle, CCardText, CRow, CCol } from '@coreui/react'
import React from 'react'
import { Row, Col } from 'react-bootstrap'

export default function FareDetails({ fareDetails }) {

    const taxesDetails = [
        {
            "id": 1,
            "code": "LK",
            "amount": 18512,
            "currency": "LKR",
            "description": "EMBARKATION TAX",
            "publishedAmount": 60,
            "publishedCurrency": "USD",
            "station": "CMB",
            "country": "LK"
        },
        {
            "id": 2,
            "code": "ZR2",
            "amount": 420,
            "currency": "LKR",
            "description": "INTERNATIONAL ADVANCED PASSENGER INFORMATION FEE DEPARTURES",
            "publishedAmount": 5,
            "publishedCurrency": "AED",
            "station": "DXB",
            "country": "AE"
        },
        {
            "id": 3,
            "code": "F62",
            "amount": 3361,
            "currency": "LKR",
            "description": "PASSENGER FACILITIES CHARGE",
            "publishedAmount": 40,
            "publishedCurrency": "AED",
            "station": "DXB",
            "country": "AE"
        }
    ]

    return (
        <CContainer fluid style={{ width: '100%', backgroundColor: '#E7ECEF', padding: 15, marginBottom: 20 }}>
            <h5 className='mb-3'>Fare Details</h5>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CRow>
                                <CCol>
                                    <CCardTitle>Total Price</CCardTitle>
                                    <CCardText>{fareDetails.equivalentCurrency} {fareDetails.totalPrice} </CCardText>
                                </CCol>
                                <CCol>
                                    <CCardTitle>Total Tax Amount</CCardTitle>
                                    <CCardText>{fareDetails.equivalentCurrency} {fareDetails.totalTaxAmount} </CCardText>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <h5 className='mt-3 mb-3'>Taxes Details</h5>
            <CRow>
                {taxesDetails.map((tax) => (
                    <CCol xs={12} sm={6} md={4} lg={3} key={tax.id}>
                        <CCard style={{ marginBottom: '15px' }}>
                            <CCardBody>
                                <CCardTitle style={{ fontSize: '1rem' }}>{tax.description}</CCardTitle>
                                <CCardText style={{ fontSize: '0.9rem' }}>{tax.currency} {tax.amount}</CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    )
}
