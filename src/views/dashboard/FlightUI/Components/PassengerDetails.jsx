import { CContainer, CCard, CCardBody, CCardTitle, CCardText, CRow, CCol } from '@coreui/react'
import React from 'react'
import { Row, Col } from 'react-bootstrap'

export default function PassengerDetails({ customerSearchData, paxDetails }) {



    const renderPassengerCard = (passenger, index) => (
        <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
            <CCard style={{ height: '100%' }}>
                <CCardBody>
                    <CCardTitle>{`${passenger.title} ${passenger.firstName} ${passenger.lastName}`}</CCardTitle>
                    <CCardText>
                        <strong>Gender:</strong> {passenger.gender} <br />
                        <strong>Passport No:</strong> {passenger.passportNo} <br />
                        <strong>Passport DOB:</strong> {passenger.passportDOB} <br />
                        <strong>Expiry Date:</strong> {passenger.expiryDate}
                    </CCardText>
                </CCardBody>
            </CCard>
        </Col>
    );

    return (
        <CContainer fluid style={{ width: '100%', backgroundColor: '#E7ECEF', padding: 15, marginBottom: 20 }}>
            <h5 className='mb-3'>Passenger Details</h5>

            <h6>Adults</h6>
            <Row>
                {paxDetails.adults.length > 0 ? paxDetails.adults.map(renderPassengerCard) : <p>No adults</p>}
            </Row>
            <br></br>

            <h6>Children</h6>
            <Row>
                {paxDetails.childs.length > 0 ? paxDetails.childs.map(renderPassengerCard) : <p>No children</p>}
            </Row>

            <br></br>

            <h6>Infants</h6>
            <Row>
                {paxDetails.infants.length > 0 ? paxDetails.infants.map(renderPassengerCard) : <p>No infants</p>}
            </Row>
        </CContainer>
    )
}
