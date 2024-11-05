import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

const SuggestionModal = ({ show, onHide, messageList, chatDetails, onMessageSelect }) => {
    const [chatError, setChatError] = useState(false);
    const [nextMessage, setNextMessage] = useState("");

    const handleAutoPopulateMessage = async () => {
        const dataSetAutoPopulate = {
            messageList: JSON.stringify(messageList),
            chatDetails: chatDetails
        };

        try {
            const response = await fetch("https://staging-gateway.aahaas.com/api/generate_auto_message", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataSetAutoPopulate)
            });

            const result = await response.json();

            if (response.ok) {
                setNextMessage(result.message);
            } else {
                setChatError(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setChatError(true);
        }

        console.log(dataSetAutoPopulate, "Data Auto Populate is");
    };

    useEffect(() => {
        handleAutoPopulateMessage();
    }, [messageList]);

    const handleMessageSelect = () => {
        if (onMessageSelect) {
            onMessageSelect(nextMessage); // Pass message back to parent
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: 18 }}>
                    Suggestion for Your Next Message
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {nextMessage ? (
                    <div
                        onClick={handleMessageSelect}
                        style={{ fontSize: 16, cursor: 'pointer', color: '#000', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    >
                        {nextMessage}
                    </div>
                ) : (
                    <h6>Loading suggestion...</h6>
                )}
                {chatError && <p style={{ color: 'red' }}>Error fetching suggestion. Please try again.</p>}
            </Modal.Body>
        </Modal>
    );
};

export default SuggestionModal;
