import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './CancellationModal.css'

export default function CancellationModal({ show, onHide, onConfirm }) {


    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleConfirm = async () => {
        if (!reason) {
            setValidationError('Reason is required');
            return;
        }

        setValidationError('');
        setIsSubmitting(true);

        try {
            onConfirm(reason);
            setReason('');
            onHide();
        } catch (error) {
            setValidationError(`Request failed: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const modalStyle = {
        backgroundColor: 'rgba(52, 58, 64, 0.5)', // Dark background with 90% opacity
    };


    return (
        <Modal show={show} onHide={onHide} size="md" dialogClassName="d-flex align-items-center custom-modal" style={modalStyle}>
            <Modal.Header closeButton>
                <Modal.Title>Cancellation Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Please Enter the reason for cancel</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        {validationError && (
                            <Form.Text className="text-danger">
                                {validationError}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { onHide(); }}>
                    No
                </Button>
                <Button
                    variant="danger"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Cancelling...' : 'Yes, Cancel'}
                </Button>
            </Modal.Footer>
        </Modal>

    )
}
