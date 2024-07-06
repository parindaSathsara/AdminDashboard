import React from 'react';
import { CCard, CCardBody, CCardImage, CCardText } from '@coreui/react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatEmpty = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', /* Full height of viewport */
            width: '100%', /* Full width of viewport */
        }}>
            <CCard style={{ width: '100%', maxWidth: '400px', border: 0 }}>
                <CCardImage orientation="top" src={require("../../../../assets/images/chatNoLoading.gif")} />
                <CCardBody>
                    <CCardText style={{ textAlign: 'center', fontSize: "24px" }}>This chat hasn't started yet.</CCardText>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ChatEmpty;