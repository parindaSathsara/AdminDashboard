import React from 'react'
import Modal from 'react-bootstrap/Modal';

export default function DetailExpander(props) {
    return (
        <Modal
            {...props}
            size="fullscreen"
            aria-labelledby="contained-modal-title-vcenter"
            className='details'
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Order Details - {props.orderid}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {props.component}
            </Modal.Body>

        </Modal>
    )
}
