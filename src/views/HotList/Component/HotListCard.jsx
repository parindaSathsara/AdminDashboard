import { CCard, CCardBody, CCardImage, CCardText, CCardTitle, CCol, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react';
import './NotificationCard.css'; // Import the CSS file
import { getHotListCardOrderDetails, readSingleOrderNotification } from '../service/HotListServices';
import DetailExpander from 'src/Panels/OrderDetails/Components/DetailExpander';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';

export default function NotificationCard({ data }) {
    const imageUrl = data?.notification_image && data.notification_image.startsWith("http")
        ? { uri: data.notification_image.split(",")[0] }
        : require("../../../assets/brand/aahaslogo.png");

    const formattedDate = data?.push_at ? moment(data.push_at).fromNow() : '';

    const cardStyle = {
        maxWidth: '540px',
        // backgroundColor: data?.admin_read_status === "Read" ? '#eef6f7' : '#c8f5dc',
        backgroundColor: data?.pivot?.read_at != null? '#eef6f7' : '#c8f5dc',
        borderRadius: '8px',
        // animation: data?.admin_read_status === "Unread" ? 'pulse 1s infinite' : 'none',
        animation: data?.pivot?.read_at === null ? 'pulse 1s infinite' : 'none',
    };




    const [orderDetails, setOrderDetails] = useState([])


    const [orderExpand, setOrderExpand] = useState(false)

    const handleCardOnClick = () => {

        readSingleOrderNotification(data?.id).then(response => {
            console.log(response, "Read Notificatio")
            return;
        })

        const orderId = parseInt(data?.data?.order_id.replace('ORD', ''), 10);
        console.log(orderId, "Order ID")
        getHotListCardOrderDetails(orderId).then(response => {
            setOrderDetails(response)
        })

        setOrderExpand(true)
    }



    return (


        <>

            <DetailExpander
                show={orderExpand}
                onHide={() => setOrderExpand(false)}
                orderid={orderDetails?.OrderId}
                component={
                    <OrderDetails dataset={orderDetails} orderid={orderDetails.OrderId} orderData={orderDetails} hideStatus={false} updatedData={() => console.log("Updated")} />
                }
            />

            <CCard className="mb-3 pulse-animation card_touchable_handler" style={cardStyle} onClick={handleCardOnClick}>
                <CRow className="g-0">
                    <CCol md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CCardImage
                            src={imageUrl}
                            style={{ borderRadius: '5px', width: '60%', height: '60%', objectFit: 'cover' }}
                            height={50}
                            width={50}
                        />
                    </CCol>
                    <CCol md={8}>
                        <CCardBody style={{ padding: '12px 16px' }}>
                            <CCardTitle style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
                                {`You got a new order #${data?.data?.order_id}`}
                            </CCardTitle>
                            <CCardText style={{ fontSize: '12px', marginBottom: '12px', color: '#495057' }}>
                                {/* You have received a new order notification. Please view more details and proceed to confirmation process. */}
                                {data?.content}
                            </CCardText>
                            <CRow>
                                <CCol md={8}>
                                    <CCardText style={{ fontSize: '12px' }}>
                                        <small className="text-muted">{formattedDate}</small>
                                    </CCardText>
                                </CCol>
                                {data?.pivot?.read_at != null ? (
                                    <CCol md={4}>
                                        <CCardText style={{ fontSize: '12px', textAlign: 'right', fontSize: 16, fontWeight: "600" }}>
                                            <small style={{ color: '#2eb43f' }}>✓✓</small>
                                        </CCardText>
                                    </CCol>
                                ) : null}
                            </CRow>
                        </CCardBody>
                    </CCol>
                </CRow>
            </CCard>
        </>

    );
}
