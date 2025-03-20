import {
    CCard,
    CCardBody,
    CCardImage,
    CCardText,
    CCardTitle,
    CCol,
    CContainer,
    CRow,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CSpinner,
    CBadge,
    CCollapse,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody
} from '@coreui/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const Bridgify = () => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCart, setSelectedCart] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [cancellationVisible, setCancellationVisible] = useState({})

    useEffect(() => {
        fetchCartItems()
    }, [])

    const fetchCartItems = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/bridgify/carts')
            if (response.data.success && response.data.data) {
                setCartItems(response.data.data)
            } else {
                throw new Error('Failed to fetch cart items')
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching cart items!',
            })
            console.error('Error fetching cart items:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCartDetails = async (shortUuid) => {
        try {
            setModalLoading(true)
            const response = await axios.get(`/bridgify/cart/${shortUuid}`)
            if (response.data.success && response.data.data) {
                setSelectedCart(response.data.data)
                setShowModal(true)

                // Initialize cancellation visibility state for each item
                const initialCancellationState = {}
                Object.keys(response.data.data).forEach(orderId => {
                    response.data.data[orderId].forEach((item, index) => {
                        initialCancellationState[`${orderId}-${index}`] = false
                    })
                })
                setCancellationVisible(initialCancellationState)
            } else {
                throw new Error('Failed to fetch cart details')
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching cart details!',
            })
            console.error('Error fetching cart details:', error)
        } finally {
            setModalLoading(false)
        }
    }

    const handleRowClick = (shortUuid) => {
        fetchCartDetails(shortUuid)
    }

    const toggleCancellationInfo = (key) => {
        setCancellationVisible(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleCancelRequest = (itemId) => {
        Swal.fire({
            title: 'Request Cancellation',
            text: 'Are you sure you want to request cancellation?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Cancellation Requested!',
                    'Your cancellation request has been submitted.',
                    'success'
                )
            }
        })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <CBadge color="success">Paid</CBadge>
            case 'pending':
                return <CBadge color="warning">Pending</CBadge>
            case 'cancelled':
                return <CBadge color="danger">Cancelled</CBadge>
            case 'FAL':
                return <CBadge color="danger">Failed</CBadge>
            default:
                return <CBadge color="info">{status}</CBadge>
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    const getCancellationInfo = (item) => {
        // This is dummy cancellation information
        const cancellationFee = item.merchant_total_price ?
            parseFloat(item.merchant_total_price) * 0.25 : 'N/A'

        return {
            deadline: item.attraction_date ?
                new Date(new Date(item.attraction_date).getTime() - 48 * 60 * 60 * 1000).toLocaleDateString() : 'N/A',
            refundAmount: item.merchant_total_price ?
                parseFloat(item.merchant_total_price) * 0.75 + ' ' + item.currency : 'N/A',
            cancellationFee: cancellationFee !== 'N/A' ?
                cancellationFee + ' ' + item.currency : 'N/A',
            policy: item.cancellation_policy || 'Standard 48-hour cancellation policy applies. Cancellations made less than 48 hours before the scheduled date are subject to a 25% cancellation fee.',
            eligibility: item.status === 'paid' ? 'Eligible for cancellation' : 'Not eligible for cancellation'
        }
    }

    return (
        <CContainer className="mt-4">
            <CCard>
                <CCardBody>
                    <CCardTitle className="mb-4">Bridgify Cart Items</CCardTitle>

                    {loading ? (
                        <div className="text-center my-4">
                            <CSpinner color="primary" />
                        </div>
                    ) : (
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Product</CTableHeaderCell>
                                    <CTableHeaderCell>Status</CTableHeaderCell>
                                    <CTableHeaderCell>Price</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {cartItems.map((item) => (
                                    <CTableRow
                                        key={item.id}
                                        onClick={() => handleRowClick(item.cart_short_uuid)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <CTableDataCell>{item.id}</CTableDataCell>
                                        <CTableDataCell>{item.data?.product_details?.title || 'N/A'}</CTableDataCell>
                                        <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
                                        <CTableDataCell>
                                            {item.data?.save_cart?.selected_value?.transaction_amount || 'N/A'}
                                            {item.data?.save_cart?.selected_value?.transaction_currency || ''}
                                        </CTableDataCell>
                                        <CTableDataCell>{formatDate(item.created_at)}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    )}
                </CCardBody>
            </CCard>

            <CModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                size="lg"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Cart Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {modalLoading ? (
                        <div className="text-center my-4">
                            <CSpinner color="primary" />
                        </div>
                    ) : selectedCart ? (
                        <>
                            {Object.keys(selectedCart).map(orderId => {
                                const orderItems = selectedCart[orderId];
                                return orderItems.map((item, index) => {
                                    const itemKey = `${orderId}-${index}`;
                                    const cancellationInfo = getCancellationInfo(item);

                                    return (
                                        <CCard key={index} className="mb-3">
                                            <CCardBody>
                                                <CCardTitle>{item.attraction_title || 'N/A'}</CCardTitle>

                                                <CRow className="mt-4">
                                                    <CCol sm={6}>
                                                        <p><strong>Status:</strong> {getStatusBadge(item.status)}</p>
                                                        <p><strong>Price:</strong> {item.merchant_total_price || 'N/A'} {item.currency || ''}</p>
                                                        <p><strong>Supplier:</strong> {item.inventory_supplier || 'N/A'}</p>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <p><strong>Date:</strong> {formatDate(item.external_created_at)}</p>
                                                        <p><strong>Order ID:</strong> {item.external_order_id}</p>
                                                        <p><strong>Booking ID:</strong> {item.order_item_uuid}</p>
                                                    </CCol>
                                                </CRow>

                                                {(item.attraction_date || item.attraction_time) && (
                                                    <CRow className="mt-3">
                                                        <CCol>
                                                            <h5>Selected Time & Date:</h5>
                                                            <p>
                                                                {item.attraction_time || 'N/A'}
                                                                {item.attraction_date ? ` on ${item.attraction_date}` : ''}
                                                            </p>
                                                        </CCol>
                                                    </CRow>
                                                )}



                                                {item.customer && (
                                                    <CRow className="mt-3">
                                                        <CCol>
                                                            <h5>Customer Details:</h5>
                                                            <p><strong>Name:</strong> {item.customer.first_name} {item.customer.last_name}</p>
                                                            <p><strong>Email:</strong> {item.customer.email}</p>
                                                            <p><strong>Phone:</strong> {item.customer.phone}</p>
                                                        </CCol>
                                                    </CRow>
                                                )}

                                                {item.tickets && item.tickets.length > 0 && (
                                                    <CRow className="mt-3">
                                                        <CCol>
                                                            <h5>Tickets:</h5>
                                                            <CTable small bordered>
                                                                <CTableHead>
                                                                    <CTableRow>
                                                                        <CTableHeaderCell>Ticket ID</CTableHeaderCell>
                                                                        <CTableHeaderCell>Title</CTableHeaderCell>
                                                                        <CTableHeaderCell>Quantity</CTableHeaderCell>
                                                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                                                    </CTableRow>
                                                                </CTableHead>
                                                                <CTableBody>
                                                                    {item.tickets.map((ticket, i) => (
                                                                        <CTableRow key={i}>
                                                                            <CTableDataCell>{ticket.external_ticket_id}</CTableDataCell>
                                                                            <CTableDataCell>{ticket.title}</CTableDataCell>
                                                                            <CTableDataCell>{ticket.quantity}</CTableDataCell>
                                                                            <CTableDataCell>
                                                                                <div className="d-flex gap-2">
                                                                                    {ticket.voucher_url && ticket.voucher_url.length > 0 ? (
                                                                                        <CButton
                                                                                            size="sm"
                                                                                            color="primary"
                                                                                            href={ticket.voucher_url[0]}
                                                                                            target="_blank"
                                                                                        >
                                                                                            View Voucher
                                                                                        </CButton>
                                                                                    ) : (
                                                                                        <CBadge color="light" textColor="dark">No Voucher</CBadge>
                                                                                    )}
                                                                                </div>
                                                                            </CTableDataCell>
                                                                        </CTableRow>
                                                                    ))}
                                                                </CTableBody>
                                                            </CTable>
                                                        </CCol>
                                                    </CRow>
                                                )}

                                                <CRow className="mt-3">
                                                    <CCol>
                                                        <CAccordion flush>
                                                            <CAccordionItem>
                                                                <CAccordionHeader>
                                                                    Cancellation Information
                                                                </CAccordionHeader>
                                                                <CAccordionBody>
                                                                    <CRow>
                                                                        <CCol sm={6}>
                                                                            <p><strong>Cancellation Deadline:</strong> {cancellationInfo.deadline}</p>
                                                                            <p><strong>Refund Amount:</strong> {cancellationInfo.refundAmount}</p>
                                                                            <p><strong>Cancellation Fee:</strong> {cancellationInfo.cancellationFee}</p>
                                                                        </CCol>
                                                                        {/* <CCol sm={6}>
                                                                            <p><strong>Eligibility:</strong> {cancellationInfo.eligibility}</p>
                                                                            <CButton
                                                                                color="danger"
                                                                                size="sm"
                                                                                className="mt-2"
                                                                                onClick={() => handleCancelRequest(item.order_item_uuid)}
                                                                                disabled={item.status !== 'paid'}
                                                                            >
                                                                                Request Cancellation
                                                                            </CButton>
                                                                        </CCol> */}
                                                                    </CRow>
                                                                    <CRow className="mt-2">
                                                                        <CCol>
                                                                            <h6>Policy:</h6>
                                                                            <p>{cancellationInfo.policy}</p>
                                                                        </CCol>
                                                                    </CRow>
                                                                </CAccordionBody>
                                                            </CAccordionItem>
                                                        </CAccordion>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <p><strong>Eligibility:</strong> {cancellationInfo.eligibility}</p>
                                                        <CButton
                                                            color="danger"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => handleCancelRequest(item.order_item_uuid)}
                                                            // disabled={item.status !== 'paid'}
                                                        >
                                                            Request Cancellation
                                                        </CButton>
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                    );
                                });
                            })}
                        </>
                    ) : (
                        <p>No cart details available</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    )
}

export default Bridgify