import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function DriverCard({ driverDetails, key, handleUpdateDriver, handleDelete }) {

    const [deleteModal, setDeleteModal] = useState({
        status: false,
        id: ''
    });

    const handleClose = () => setDeleteModal({ status: false, id: '' });

    const handleYes = () => {
        handleDelete(deleteModal.id);
        handleClose();
    }

    return (
        <div key={key} className='driver-card'>
            <h5 className='driver-name'>{driverDetails.driver_name}</h5>
            <h5 className='driver-regcountry'>Reg country : {driverDetails.registered_country}</h5>
            <div className='driver-details'>
                <p>reg date : {driverDetails.registered_date === '' || driverDetails.registered_date === undefined || driverDetails.registered_date === null ? 'Not avaliblte' : driverDetails.registered_date}</p>
                <p>nic n : {driverDetails.driver_nic === '' || driverDetails.driver_nic === undefined || driverDetails.driver_nic === null ? 'Not avaliblte' : driverDetails.driver_nic}</p>
                <p>driver type : {driverDetails.driver_type === '' || driverDetails.driver_type === undefined || driverDetails.driver_type === null ? 'Not avaliblte' : driverDetails.driver_type}</p>
            </div>
            <div className='driver-card-icons'>
                <FontAwesomeIcon icon={faUserPen} onClick={() => handleUpdateDriver(driverDetails)} />
                <FontAwesomeIcon icon={faTrashCan} onClick={() => setDeleteModal({ status: true, id: driverDetails.id })} />
            </div>
            <Modal show={deleteModal.status} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Delete driver</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure want to delete the driver details</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>No</Button>
                    <Button variant="primary" onClick={handleYes}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DriverCard