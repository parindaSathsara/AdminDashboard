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
} from '@coreui/react'
import axios from 'axios'
import MaterialTable from 'material-table'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const Bridgify = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCart, setSelectedCart] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    fetchCartItems()
  }, [])

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

  const data = {
    columns: [
      { title: 'Short UUID', field: 'cart_short_uuid', align: 'left' },
      { title: 'Payment Status', field: 'status', align: 'left' },
      { title: 'Transaction Amount', field: 'transaction_amount', align: 'left' },
      { title: 'Product Title', field: 'product_details', align: 'left' },
      { title: 'Selected Timeslot', field: 'timeslots', align: 'left' },
      { title: 'Ticket Details', field: 'tickets', align: 'left' },
      { title: 'Customer Name', field: 'customer', align: 'left' },
      {title:'Email & Phone', field:'email_phone', align:'left'},
      {title:'View More', field:'actions', align:'left'}
    ],
    rows: cartItems.map((item) => {
      // Handle product_details whether it's a string or an object
      // const productDetails = typeof item?.data?.product_details === 'object'
      //     ? item?.data?.product_details?.title
      //     : item?.data?.product_details || 'N/A';

      const productDetails = item?.data?.product_details?.title || 'N/A'
      const seletedTimeslot = item?.data?.requires?.timeslots?.selected_value || 'N/A'
      const customerDetails = item?.data?.requires?.['customer-info']?.selected_value || []
        // console.log(item, 'item');
        
      return {
        cart_short_uuid: item?.cart_short_uuid,
        status: getStatusBadge(item.status),
        transaction_amount: item?.data?.save_cart?.selected_value?.transaction_amount,
        product_details: productDetails,
        timeslots: seletedTimeslot,
        tickets:
          item?.data?.requires?.tickets?.selected_value
            ?.map((ticket) => `${ticket.product_id}: ${ticket.quantity}`)
            .join(', ') || 'N/A',
        customer:
          customerDetails.length > 0
            ? customerDetails.map((customer, index) => (
                <div key={index}>{`${customer.FirstName || ''} ${customer.LastName || ''}`}</div>
              ))
            : 'N/A',
        email_phone:
          customerDetails.length > 0
            ? customerDetails.map((customer, index) => (
                <div key={index}>{`${customer.Email || ''} ${customer.Phoneno || ''}`}</div>
              ))
            : 'N/A', 
        actions: <CButton  color="primary" onClick={() => handleRowClick(item?.cart_short_uuid)}>View More</CButton>   
      }
    }),
  }

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/bridgify/carts')
      if (response.data.success && response.data.data) {
        setCartItems(response.data.data)
        console.log('Cart Items:', response.data.data);
        
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
        console.log('Cart Items:', response.data.data);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardBody>
          <CCardTitle className="mb-4">Bridgify Cart Items</CCardTitle>

          {loading ? (
            <div className="text-center my-4">
              <CSpinner color="primary" />
              <p className='mt-3 font-weight-bold'>Loading cart items...</p>
              <p className='text-muted mt-2'
              >This may take a while</p>
            </div>
          ) : (
            // <CTable hover responsive>
            //     <CTableHead>
            //         <CTableRow>
            //             <CTableHeaderCell>ID</CTableHeaderCell>
            //             <CTableHeaderCell>Product</CTableHeaderCell>
            //             <CTableHeaderCell>Status</CTableHeaderCell>
            //             <CTableHeaderCell>Price</CTableHeaderCell>
            //             <CTableHeaderCell>Date</CTableHeaderCell>
            //         </CTableRow>
            //     </CTableHead>
            //     <CTableBody>
            //         {cartItems.map((item) => (
            //             <CTableRow
            //                 key={item.id}
            //                 onClick={() => handleRowClick(item.cart_short_uuid)}
            //                 style={{ cursor: 'pointer' }}
            //             >
            //                 <CTableDataCell>{item.id}</CTableDataCell>
            //                 <CTableDataCell>{item.data?.product_details?.title || 'N/A'}</CTableDataCell>
            //                 <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
            //                 <CTableDataCell>
            //                     {item.data?.save_cart?.selected_value?.transaction_amount || 'N/A'}
            //                     {item.data?.save_cart?.selected_value?.transaction_currency || ''}
            //                 </CTableDataCell>
            //                 <CTableDataCell>{formatDate(item.created_at)}</CTableDataCell>
            //             </CTableRow>
            //         ))}
            //     </CTableBody>
            // </CTable>
            <MaterialTable
              title="Traveller Experience"
              columns={data.columns}
              data={data.rows}
              options={{
                headerStyle: { fontSize: '14px' },
                cellStyle: { fontSize: '14px' },
                paging: false,
                search: false,
                columnsButton: true,
                exportButton: true,
                grouping: true,
                rowStyle: {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
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
              {Object.keys(selectedCart).map((orderId) => {
                const orderItems = selectedCart[orderId]
                return orderItems.map((item, index) => (
                  <CCard key={index} className="mb-3">
                    <CCardBody>
                      <CCardTitle>{item.attraction_title || 'N/A'}</CCardTitle>

                      <CRow className="mt-4">
                        <CCol sm={6}>
                          <p>
                            <strong>Status:</strong> {getStatusBadge(item.status)}
                          </p>
                          <p>
                            <strong>Price:</strong> {item.merchant_total_price || 'N/A'}{' '}
                            {item.currency || ''}
                          </p>
                          <p>
                            <strong>Supplier:</strong> {item.inventory_supplier || 'N/A'}
                          </p>
                        </CCol>
                        <CCol sm={6}>
                          <p>
                            <strong>Date:</strong> {formatDate(item.external_created_at)}
                          </p>
                          <p>
                            <strong>Order ID:</strong> {item.external_order_id}
                          </p>
                          <p>
                            <strong>Booking ID:</strong> {item.order_item_uuid}
                          </p>
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

                      {item.cancellation_policy && (
                        <CRow className="mt-3">
                          <CCol>
                            <h5>Cancellation Policy:</h5>
                            <p>{item.cancellation_policy}</p>
                          </CCol>
                        </CRow>
                      )}

                      {item.customer && (
                        <CRow className="mt-3">
                          <CCol>
                            <h5>Customer Details:</h5>
                            <p>
                              <strong>Name:</strong> {item.customer.first_name}{' '}
                              {item.customer.last_name}
                            </p>
                            <p>
                              <strong>Email:</strong> {item.customer.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {item.customer.phone}
                            </p>
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
                                        <CBadge color="light" textColor="dark">
                                          No Voucher
                                        </CBadge>
                                      )}
                                    </CTableDataCell>
                                  </CTableRow>
                                ))}
                              </CTableBody>
                            </CTable>
                          </CCol>
                        </CRow>
                      )}
                    </CCardBody>
                  </CCard>
                ))
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
