import React, { useState } from 'react';
import { CCard, CCardBody, CRow, CCol, CModal, CModalBody, CModalHeader, CModalFooter, CButton } from '@coreui/react';
// import './SentNotifications.css'; // Import the custom CSS file
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

function SentNotifications({ data }) {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    }

    // Format the date, time, and day separately
    const dateObject = new Date(data.created_at);
    const formattedDate = dateObject.toLocaleDateString(); // e.g., "MM/DD/YYYY" or "DD/MM/YYYY" depending on locale
    const formattedTime = dateObject.toLocaleTimeString(); // e.g., "HH:MM:SS AM/PM"
    const formattedDay = dateObject.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"

    return (
        <div>
            <CCard className="notification-card" onClick={() => setShowModal(true)}>
                <CCardBody>
                    <CRow className='c-row'>
                        <CCol xs="12" md="8">
                            <h5 className="notification-title">{data.title}</h5>
                            <p className="notification-description">{data.description}</p>
                        </CCol>
                        <CCol xs="12" md="4" className="text-md-right" style={{ textAlign: 'right' }}>
                            <small className="notification-date">
                                {formattedDate} - {formattedTime} ({formattedDay})
                            </small>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CModal visible={showModal} onClose={handleCloseModal} size="lg">
                <CModalHeader closeButton className='modelContainer'>
                    <h5>Notification Info</h5>
                </CModalHeader>
                <CModalBody className='modelBody'>
                    <p><strong>Title:</strong> {data?.title ? data.title : "Title not available."}</p>
                    <p><strong>Description:</strong> {data?.description ? data.description : "Description not available."}</p>
                    <p><strong>Data:</strong> {data?.redirectLink ? data.redirectLink : "Data not available."}</p>
                    <p><strong>Date:</strong> {formattedDate ? (formattedDate + " "+(formattedDay ? formattedDay :null )) : "Date not available."}</p>
                    <p><strong>Time:</strong> {formattedTime ? formattedTime : "Time not available."}</p>
                    <p><strong>Day:</strong> {formattedDay ? formattedDay : "Day not available."}</p>
                </CModalBody>
                <CModalFooter id='modalFooter' className='modelContainer'>
                    <p>{data.user.name}</p>
                    <p>{data.user.email}</p>
                </CModalFooter>
            </CModal>
        </div>
    );
}

export default SentNotifications;
