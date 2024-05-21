import { CButton, CCardImage, CToast, CToastBody, CToastClose, CToastHeader } from '@coreui/react';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from 'src/firebase';

export default function InAppNotificationService() {
    const [toasts, setToasts] = useState([]);  // State to store multiple toasts

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'orders'),
            (querySnapshot) => {
                if (!querySnapshot.empty) {
                    console.log("Inside Snap");
                    addNewToast()
                } else {
                    console.log("No orders found.");
                }
            },
            (error) => {
                console.error("Error fetching real-time data: ", error);
            }
        );
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [1]);

    const ToastMessage = () => (
        <CToast autohide={false} visible={true} delay={5000} key={new Date().getTime()}>
            <CToastHeader closeButton>

                {/* <div className="fw-bold me-auto">CoreUI for React.js</div>
                <small>Just now</small> */}
            </CToastHeader>
            <CToastBody>Hello, world! This is a toast message.</CToastBody>
        </CToast>
    );

    const addNewToast = () => {
        setToasts(prevToasts => [...prevToasts, ToastMessage()]);  // Add new toast to the array
    };

    return (
        <>
            <CButton color="primary" onClick={addNewToast}>Send a toast</CButton>
            <div className="toast-container position-fixed top-0 end-0 p-3">
                {/* {toasts} */}

                <CToast autohide={false} visible={true} delay={5000} key={new Date().getTime()}>
                    <CToastHeader closeButton>

                        <div className="fw-bold me-auto">Woohoo! You've just received a new order!</div>

                    </CToastHeader>
                    <CToastBody>
                    <CCardImage 
            src={"https://e1.pxfuel.com/desktop-wallpaper/707/316/desktop-wallpaper-lotustower-lotus-tower.jpg"} 
            style={{ height: 150,width:'100%', objectFit: 'cover' }} 
          />
                    </CToastBody>
                </CToast>
            </div>
        </>
    );
}
