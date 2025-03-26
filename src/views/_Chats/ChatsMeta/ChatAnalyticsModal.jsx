import { CCol, CRow, CWidgetStatsA } from '@coreui/react';
import { getDate } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Message from './../Components/Message';

const ChatAnalyticsModal = (props) => {

    const [chatMessage, setChatMessage] = useState([])
    console.log('Last Message Content:', props.message)
    const [averageResponseTime, setAverageResponseTime] = useState('N/A')

    const getDateAndtime = (timestamp) => {
        if (timestamp && timestamp.seconds) {
          return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
        }
        return null
    }

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    const calculateAverageResponseTime = (messages) => {
        let totalResponseTime = 0;
        let responseCount = 0;

        for (let i = 1; i < messages.length; i++) {
            if (messages[i].role === 'Admin' && messages[i - 1].role === 'Customer') {
                const adminTime = getDateAndtime(messages[i].createdAt);
                const customerTime = getDateAndtime(messages[i - 1].createdAt);
                if (adminTime && customerTime) {
                    const responseTime = (adminTime - customerTime) / 1000; // convert to seconds
                    totalResponseTime += responseTime;
                    responseCount++;
                }
            }
        }

        const averageResponseTimeInSeconds = responseCount > 0 ? (totalResponseTime / responseCount) : 0;
        return responseCount > 0 ? formatDuration(averageResponseTimeInSeconds) : 'N/A';
    }


const getConversationStatus = (messages) => {
    let totalMessages = messages.length;
    let adminMessages = messages.filter(msg => msg?.role === 'Admin').length;
    let customerMessages = messages.filter(msg => msg?.role === 'Customer').length;
    let supplierMessages = messages.filter(msg => msg?.role === 'Supplier').length;
    let adminInvolvement = totalMessages > 0 ? (adminMessages / totalMessages) * 100 : 0;
    let customerInvolvement = totalMessages > 0 ? (customerMessages / totalMessages) * 100 : 0;
    let supplierInvolvement = totalMessages > 0 ? (supplierMessages / totalMessages) * 100 : 0;

    adminInvolvement = parseFloat(adminInvolvement.toFixed(1));
    customerInvolvement = parseFloat(customerInvolvement.toFixed(1));
    supplierInvolvement = parseFloat(supplierInvolvement.toFixed(1));

    return {
        totalMessages,
        adminMessages,
        customerMessages,
        supplierMessages,
        adminInvolvement,
        customerInvolvement,
        supplierInvolvement
    };
};

const [conversationStatus, setConversationStatus] = useState({
    totalMessages: 0,
    adminMessages: 0,
    customerMessages: 0,
    supplierMessages: 0,
    adminInvolvement: '0%',
    customerInvolvement: '0%',
    supplierInvolvement: '0%'
});

    useEffect(() => {
        setAverageResponseTime(calculateAverageResponseTime(props.message));
        setConversationStatus(getConversationStatus(props.message));
        // console.log('Conversation Status:', getConversationStatus(props.message));
    }, [props.message]);


    return (
        <Modal size='xl' show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Chat Analytics</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <CRow>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                           {averageResponseTime}
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Average Response Time 
                                </h5>
                            </>} />
                    </CCol>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                          {conversationStatus?.totalMessages}
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Total Message
                                </h5>
                            </>} />
                    </CCol>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                           {conversationStatus?.adminMessages}
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                   Admin Messages
                                </h5>
                            </>} />
                    </CCol>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                          {conversationStatus?.customerMessages}
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Customer Messages
                                </h5>
                            </>} />
                    </CCol>
                </CRow>
                <br></br>
                <CRow>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                            {conversationStatus?.supplierMessages}
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Supplier Messages
                                </h5>
                            </>} />
                    </CCol>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                            {conversationStatus?.adminInvolvement}%
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Admin Involvement
                                </h5>
                            </>} />
                    </CCol>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                            {conversationStatus?.customerInvolvement}%
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Customer Involvement
                                </h5>
                            </>} />
                    </CCol>
                    <CCol sm={3} xl={3} xxl={3}>
                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                            {conversationStatus?.supplierInvolvement}%
                        </h2>
                        </>}
                            title={<>
                                <h5 className=" fw-normal">
                                    Supplier Involvement
                                </h5>
                            </>} />
                    </CCol>
                </CRow>
                                




            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button> */}
            </Modal.Footer>
        </Modal>
    );
};

export default ChatAnalyticsModal;