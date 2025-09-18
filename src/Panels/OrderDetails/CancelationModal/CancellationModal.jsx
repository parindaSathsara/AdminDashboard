import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function CancellationModal({ show, onHide, onConfirm }) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleConfirm = async () => {
        if (!reason || !reason.trim()) {
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

    const handleClose = () => {
        setReason('');
        setValidationError('');
        onHide();
    };

    // Inline styles for centering
    const modalStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const dialogStyles = {
        margin: '0 auto',
        maxWidth: '500px'
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="md" 
            centered
            style={modalStyles}
            dialogStyle={dialogStyles}
        >
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
                            isInvalid={!!validationError}
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
                <Button variant="secondary" onClick={handleClose}>
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