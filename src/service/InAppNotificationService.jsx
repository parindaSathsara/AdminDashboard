import { CButton, CToast, CToastBody, CToastClose, CToastHeader, CToaster } from '@coreui/react'
import React, { useRef, useState } from 'react'

export default function InAppNotificationService() {
    const [toasts, setToasts] = useState([]);  // Change the state to an array to store multiple toasts
    const toaster = useRef();

    const exampleToast = () => {
        return (
            <CToast autohide={true} visible={true}>
                <CToastHeader closeButton>
                    <svg
                        className="rounded me-2"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                        role="img"
                    >
                        <rect width="100%" height="100%" fill="#007aff"></rect>
                    </svg>
                    <div className="fw-bold me-auto">CoreUI for React.js</div>
                    <small>7 min ago</small>
                </CToastHeader>
                <CToastBody>Hello, world! This is a toast message.</CToastBody>
            </CToast>
        );
    };

    const addNewToast = () => {
        setToasts([...toasts, exampleToast()]);  // Add new toast to the array
    };

    return (
        <>
            <CButton color="primary" onClick={addNewToast}>Send a toast</CButton>
            <div className="toast-container position-fixed top-0 end-0 p-3">
                {toasts}
            </div>
        </>
    );
}