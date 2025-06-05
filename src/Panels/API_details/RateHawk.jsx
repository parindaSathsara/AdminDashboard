import {
  CCard,
  CCardBody,
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
  CAlert,
  CCollapse,
  CFormInput,
} from '@coreui/react'
import axios from 'axios'
import MaterialTable from 'material-table'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const RateHawk = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    created_at: {
      from_date:
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00', // Last 30 days
    },
  })
  const [pagination, setPagination] = useState({
    page_size: 100,
    page_number: 1,
  })

  useEffect(() => {
    fetchOrders()
  }, [searchParams, pagination])

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CBadge color="success">Completed</CBadge>
      case 'cancelled':
        return <CBadge color="danger">Cancelled</CBadge>
      case 'pending':
        return <CBadge color="warning">Pending</CBadge>
      default:
        return <CBadge color="info">{status}</CBadge>
    }
  }

  const data = {
    columns: [
      { title: 'Ratehawk Order ID', field: 'order_id', align: 'left' },
      { title: 'Partner Order ID', field: 'partner_order_id', align: 'left' },
      { title: 'Agreement Number', field: 'agreement_number', align: 'left' },
      { title: 'Status', field: 'status', align: 'left' },
      { title: 'Hotel', field: 'hotel_name', align: 'left' },
      { title: 'Check-in/Check-out', field: 'dates', align: 'left' },
      { title: 'Amount', field: 'amount', align: 'left' },
      { title: 'Guests', field: 'guests', align: 'left' },
      { title: 'Created At', field: 'created_at', align: 'left' },
      { title: 'Actions', field: 'actions', align: 'left' },
    ],
    rows: orders.map((order) => {
        // Convert date strings to Sri Lanka time
        const toSLTime = (dateString) => {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          return new Date(date.getTime() + (5.5 * 60 * 60 * 1000))
            .toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
        };
      
        // For created_at, include time
        const toSLDateTime = (dateString) => {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          return new Date(date.getTime() + (5.5 * 60 * 60 * 1000))
            .toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
        };
      
        return {
          order_id: order.order_id, 
          partner_order_id: order.partner_data.order_id, 
          agreement_number: order.agreement_number, 
          status: order.status, 
          hotel_name: order.hotel_data?.id || 'N/A', 
          dates: `${toSLTime(order.checkin_at)} to ${toSLTime(order.checkout_at)}`,
          amount: `${order.amount_sell?.amount || '0'} ${order.amount_sell?.currency_code || ''}`,
          guests: order.rooms_data?.reduce((total, room) => total + room.guest_data?.adults_number, 0) || 0, 
          created_at: toSLDateTime(order.created_at), 
          actions: (
            <CButton color="primary" size="sm" onClick={() => handleRowClick(order)}>
              View Details
            </CButton>
          )
        };
      })
      
      
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/ratehawk/order-info', {
        ordering: {
          ordering_type: 'desc',
          ordering_by: 'created_at',
        },
        pagination: pagination,
        search: searchParams,
        language: 'en',
      })

      if (response.data.status === 200 && response.data.data?.orders) {
        setOrders(response.data.data.orders)
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching orders!',
      })
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleCancellation = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
      })

      if (result.isConfirmed) {
        // Here you would call your cancellation API
        // await axios.post(`/ratehawk/cancel-order/${orderId}`)

        Swal.fire('Cancelled!', 'The order has been cancelled.', 'success')
        fetchOrders() // Refresh the orders list
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to cancel the order.', 'error')
      console.error('Error cancelling order:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const renderCancellationPolicy = (policies) => {
    if (!policies || policies.length === 0) {
      return <p>No cancellation policy available</p>
    }

    return policies.map((policy, index) => (
      <div key={index} className="mb-2">
        <p>
          <strong>From:</strong> {policy.start_at ? formatDate(policy.start_at) : 'Now'}
          {' to '}
          <strong>Until:</strong> {policy.end_at ? formatDate(policy.end_at) : 'Check-in'}
        </p>
        <p>
          <strong>Penalty:</strong> {policy.penalty.amount} {policy.penalty.currency_code}
        </p>
        {index < policies.length - 1 && <hr />}
      </div>
    ))
  }

  const renderGuestInfo = (guests) => {
    if (!guests || guests.length === 0) return 'N/A'

    return guests.map((guest, index) => (
      <div key={index}>
        {guest.first_name} {guest.last_name}{' '}
        {guest.is_child ? `(Child, Age: ${guest.age || 'N/A'})` : ''}
      </div>
    ))
  }

  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardBody>
          <CCardTitle className="mb-4">RateHawk Orders</CCardTitle>

          {/* Search Filters */}
          {/* <CRow className="mb-3">
                        <CCol md={4}>
                            <CFormInput
                                type="date"
                                name="created_at.from_date"
                                label="From Date"
                                value={searchParams.created_at.from_date.split('T')[0]}
                                onChange={(e) => setSearchParams({
                                    ...searchParams,
                                    created_at: {
                                        ...searchParams.created_at,
                                        from_date: e.target.value + 'T00:00'
                                    }
                                })}
                            />
                        </CCol>
                        <CCol md={2}>
                            <CButton color="primary" onClick={fetchOrders} className="mt-4">
                                Search
                            </CButton>
                        </CCol>
                    </CRow> */}

          {loading ? (
            <div className="text-center my-4">
              <CSpinner color="primary" />
              <p className="mt-3 font-weight-bold">Loading orders...</p>
            </div>
          ) : (
            <MaterialTable
              title="Hotel Bookings"
              columns={data.columns}
              data={data.rows}
              options={{
                headerStyle: { fontSize: '14px' },
                cellStyle: { fontSize: '14px' },
                paging: true,
                pageSize: pagination.page_size,
                pageSizeOptions: [10, 20, 50, 100],
                search: false,
                columnsButton: true,
                exportButton: true,
                grouping: true,
                rowStyle: {
                  backgroundColor: '#f5f5f5',
                },
              }}
              onChangePage={(page, pageSize) => {
                setPagination({
                  page_number: page + 1,
                  page_size: pageSize,
                })
              }}
            />
          )}
        </CCardBody>
      </CCard>

      {/* Order Details Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="xl" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>Order Details - {selectedOrder?.order_id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedOrder ? (
            <>
              <CRow className="mb-3">
                <CCol>
                  <h5>Basic Information</h5>
                  <CTable bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell>Agreement Number</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.agreement_number}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Invoice ID</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.invoice_id}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Created At</CTableHeaderCell>
                        <CTableDataCell>{formatDate(selectedOrder.created_at)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Modified At</CTableHeaderCell>
                        <CTableDataCell>{formatDate(selectedOrder.modified_at)}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <h5>Hotel Information</h5>
                  <CTable bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell>Hotel ID</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.hotel_data?.id || 'N/A'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Check-in</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.checkin_at}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Check-out</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.checkout_at}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Nights</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.nights}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Supplier Confirmation</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedOrder.supplier_data?.confirmation_id || 'N/A'}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <h5>Financial Information</h5>
                  <CTable bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell>Sell Amount</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedOrder.amount_sell?.amount}{' '}
                          {selectedOrder.amount_sell?.currency_code}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell>Payable Amount</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedOrder.amount_payable?.amount}{' '}
                          {selectedOrder.amount_payable?.currency_code}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell>Payment Status</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedOrder.payment_data?.paid_at
                            ? `Paid on ${formatDate(selectedOrder.payment_data.paid_at)}`
                            : `Due on ${formatDate(selectedOrder.payment_data?.payment_due)}`}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <h5>Rooms & Guests</h5>
                  {selectedOrder.rooms_data?.map((room, index) => (
                    <CCard key={index} className="mb-3">
                      <CCardBody>
                        <h6>
                          Room {index + 1}: {room.room_name}
                        </h6>
                        <p>
                          <strong>Meal:</strong> {room.meal_name}
                        </p>
                        <p>
                          <strong>Bedding:</strong> {room.bedding_name?.join(', ') || 'N/A'}
                        </p>

                        <h6 className="mt-2">
                          Guests ({room.guest_data?.adults_number} Adults,{' '}
                          {room.guest_data?.children_number} Children)
                        </h6>
                        {renderGuestInfo(room.guest_data?.guests)}
                      </CCardBody>
                    </CCard>
                  ))}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <h5>Cancellation Information</h5>
                  <CCard>
                    <CCardBody>
                      <p>
                        <strong>Cancellable:</strong> {selectedOrder.is_cancellable ? 'Yes' : 'No'}
                      </p>
                      {selectedOrder.cancellation_info?.free_cancellation_before && (
                        <p>
                          <strong>Free Cancellation Before:</strong>{' '}
                          {formatDate(selectedOrder.cancellation_info.free_cancellation_before)}
                        </p>
                      )}

                      <h6 className="mt-2">Cancellation Policies</h6>
                      {renderCancellationPolicy(selectedOrder.cancellation_info?.policies)}

                      {/* {selectedOrder.is_cancellable && (
                                                <div className="text-center mt-3">
                                                    <CButton 
                                                        color="danger" 
                                                        onClick={() => handleCancellation(selectedOrder.order_id)}
                                                    >
                                                        Cancel Booking
                                                    </CButton>
                                                </div>
                                            )} */}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <h5>Additional Information</h5>
                  <CTable bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell>User Email</CTableHeaderCell>
                        <CTableDataCell>{selectedOrder.user_data?.email || 'N/A'}</CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell>User Comment</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedOrder.user_data?.user_comment || 'N/A'}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell>Order Comment</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedOrder.partner_data?.order_comment || 'N/A'}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </>
          ) : (
            <p>No order details available</p>
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

export default RateHawk
