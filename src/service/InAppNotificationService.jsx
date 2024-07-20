import { CBadge, CButton, CCard, CCardImage, CCardText, CCol, CRow, CToast, CToastBody, CToastClose, CToastHeader } from '@coreui/react';
import { collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView';
import { getMoreDataSet, getMoreDataSetByID } from 'src/Panels/OrderDetails/MoreOrderView/functions/getCheckoutProductData';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import { db } from 'src/firebase';

export default function InAppNotificationService() {
    const [toasts, setToasts] = useState([]);  // State to store multiple toasts

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'orders'),
            (querySnapshot) => {
                if (!querySnapshot.empty) {
                    // console.log("Inside Snap");

                    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                    const lastOrderData = lastDoc.data();
                    console.log("Last Order: ", lastOrderData);



                    var dataSet = {}

                    const createdAtVal = moment(lastOrderData?.created_at)

                    if (moment().diff(createdAtVal, 'seconds') < 15) {
                        getMoreDataSet(lastOrderData?.category, lastOrderData?.related_id).then(response => {

                            console.log(response, "Response Data Object")

                            if (lastOrderData?.category == 3) {
                                addNewToast({
                                    product_image: response?.lifestyleBasic?.image?.split(",")?.[0],
                                    product_title: response?.lifestyleBasic?.lifestyle_name,
                                    dataSet: response,
                                    category: lastOrderData?.category,
                                    id: lastOrderData?.order_product_id


                                })
                            }
                            else if (lastOrderData?.category == 1 || lastOrderData?.category == 2) {
                                addNewToast({
                                    product_image: response?.essentialsBasic?.product_images?.split(",")?.[0],
                                    product_title: response?.essentialsBasic?.listing_title,
                                    dataSet: response,
                                    category: lastOrderData?.category,
                                    id: lastOrderData?.order_product_id
                                })
                            }
                            else if (lastOrderData?.category == 5) {
                                addNewToast({
                                    product_image: response?.educationData?.image_path?.split(",")?.[0],
                                    product_title: response?.educationData?.course_name,
                                    dataSet: response,
                                    category: lastOrderData?.category,
                                    id: lastOrderData?.order_product_id
                                })
                            }


                        }).catch(response => {
                            console.log(response, "Catch Response is")
                            // setLoading(false)
                        })
                    }










                } else {
                    // console.log("No orders found.");
                }
            },
            (error) => {
                console.error("Error fetching real-time data: ", error);
            }
        );
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);





    const [orderDataSetStatic, setOrderDataSetStatic] = useState([])
    const [moreOrderModal, setMoreOrderModal] = useState(false)

    const [category, setCategory] = useState(0)

    const handleOrderView = (data) => {
        setOrderDataSetStatic(data?.dataSet)
        setMoreOrderModal(true)
        setCategory(data?.category)
    }

    const ToastMessage = (data) => (
        <CToast autohide={true} visible={true} delay={5000} key={new Date().getTime()}>
            <CToastHeader closeButton>

                <div className="fw-bold me-auto" style={{ color: '#070e1a' }}>Woohoo! You've just received a new order!</div>

            </CToastHeader>
            <CToastBody>
                <CRow>
                    <CCol xs="auto" style={{ paddingRight: 0 }}> {/* Use "auto" to size according to content */}
                        <CCardImage
                            src={data?.product_image}
                            style={{ height: 75, width: 75, objectFit: 'cover', borderRadius: '10px' }} // Add borderRadius here
                        />
                    </CCol>
                    <CCol style={{ paddingTop: 5 }}>
                        <CCardText style={{ fontSize: 16, fontWeight: '600', color: '#070e1a', lineHeight: "16px", marginBottom: 0 }}>{data?.product_title}</CCardText>
                        <CButton color="primary" style={{ fontSize: 14, padding: 2, paddingRight: 10, paddingLeft: 10, marginTop: 5, backgroundColor: '#070e1a', border: 'none' }} onClick={() => handleOrderView(data)}>
                            View Order
                        </CButton>
                    </CCol>
                </CRow>
            </CToastBody>
        </CToast>
    );

    const [orderData, setOrderData] = useState([])



    const addNewToast = (data) => {

        getMoreDataSetByID(data?.id).then(response => {
            const dataSet = {
                info: response?.[0],
                customerData: response?.[0]?.customerData
            }

            console.log(dataSet, "Passing Dataset value data")

            setOrderData(dataSet)
        })




        setToasts(prevToasts => [...prevToasts, ToastMessage(data)]);  // Add new toast to the array
    };





    return (
        <>

            <MoreOrderView
                show={moreOrderModal}
                onHide={() => setMoreOrderModal(false)}
                category={category}
                notificationView
                notificationViewData={orderDataSetStatic}
                preID=""
                productViewData
                productViewComponent={<OrderDetails orderid={orderData} orderData={orderData} hideStatus={false} productViewData />}
            />

            {/* <CButton color="primary" onClick={addNewToast}>Send a toast</CButton> */}
            <div className="toast-container position-fixed top-0 end-0 p-3">
                {toasts}


            </div>
        </>
    );
}
