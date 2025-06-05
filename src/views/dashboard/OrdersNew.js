import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CSpinner,
  CAlert,
  CButton,
  CBadge,
  CWidgetStatsB
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilNoteAdd, cilViewStream } from '@coreui/icons';
// Import axios in your actual project
import axios from 'axios';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import { getAllCardData, getAllDataUserWise, getDashboardOrdersIdWise } from 'src/service/api_calls';


const OrdersNew = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
    const [cardData, setCardData] = useState({
      orderCount: 0,
      customerCount: 0,
      salesCount: "",
      suppliersCount: 0
    });
  

  const fetchOrders = async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual axios import
      const response = await axios.get('/fetch_all_orders_userwise_products', {
        params: {
          page: page,
          per_page: perPage
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
        setPagination(response.data.meta);
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchOrders(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    fetchOrders(1, newPerPage);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'completed': 'success',
      'cancelled': 'danger',
      'processing': 'info',
      'paid': 'success',
      'unpaid': 'danger'
    };
    
    return statusColors[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  const { currencyData, setCurrencyData } = useContext(CurrencyContext);

  // Statistics using useMemo
  const orderStats = useMemo(() => {
    const totalOrders = pagination.total;
    const completedOrders = orders.filter(order => order.CheckOutStatus === 'completed').length;
    const paidOrders = orders.filter(order => order.MainPayStatus === 'paid').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.amount || order.total_amount || 0)), 0);

    return {
      totalOrders,
      completedOrders,
      paidOrders,
      totalRevenue
    };
  }, [orders, pagination.total]);

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    const currentPage = pagination.current_page;
    const lastPage = pagination.last_page;

    // Previous button
    items.push(
      <CPaginationItem
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </CPaginationItem>
    );

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <CPaginationItem key={1} onClick={() => handlePageChange(1)}>
          1
        </CPaginationItem>
      );
      if (startPage > 2) {
        items.push(<CPaginationItem key="ellipsis1" disabled>...</CPaginationItem>);
      }
    }

    // Add page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <CPaginationItem
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </CPaginationItem>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        items.push(<CPaginationItem key="ellipsis2" disabled>...</CPaginationItem>);
      }
      items.push(
        <CPaginationItem key={lastPage} onClick={() => handlePageChange(lastPage)}>
          {lastPage}
        </CPaginationItem>
      );
    }

    // Next button
    items.push(
      <CPaginationItem
        key="next"
        disabled={currentPage === lastPage}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </CPaginationItem>
    );

    return items;
  }, [pagination.current_page, pagination.last_page]);

   useEffect(() => {
      initialDataHandler("loading");
    }, []);
  
  const initialDataHandler = (type) => {


    if (type == "loading") {
      setLoading(true);
    }

    getAllCardData().then(res => {
      setCardData(res);
      setLoading(false);
    });
  };
  return (
    <>
      {/* Statistics Widgets */}
      <CRow>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              color="success"
              inverse
              value={cardData.orderCount + ""}
              title="Orders Count"
              progress={{ value: 100.00 }}
              text="Last 30 Days Order Count"
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              value={CurrencyConverter("USD", cardData.salesCount, currencyData)}

              title="Sales"
              color="danger"
              inverse
              progress={{ value: 100.0 }}
              text="Last 30 Days Sales"
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              value={cardData.customerCount + ""}
              title="Customers"
              color="warning"
              inverse
              progress={{ value: 100.0 }}
              text="Last 30 Days Customer Count"
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              value={cardData.suppliersCount + ""}
              title="Suppliers"
              color="info"
              inverse
              progress={{ value: 100.0 }}
              text="Last 30 Days Supplier Count"
            />
          </CCol>
        </CRow>

      {/* Main Orders Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Orders Management</strong>
              {/* <div className="float-end">
                <CButton color="primary" size="sm" className="me-2">
                  <CIcon icon={cilNoteAdd} /> Add Order
                </CButton>
                <CButton color="secondary" size="sm">
                  <CIcon icon={cilViewStream} /> Export
                </CButton>
              </div> */}
            </CCardHeader>
            <CCardBody>
              {/* Controls */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Show:</span>
                    <CFormSelect
                      size="sm"
                      value={pagination.per_page}
                      onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
                      style={{ width: 'auto' }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </CFormSelect>
                    <span className="ms-2">entries</span>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="text-end">
                    <small className="text-muted">
                      Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                      {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                      {pagination.total} entries
                    </small>
                  </div>
                </CCol>
              </CRow>

              {/* Error Alert */}
              {error && (
                <CAlert color="danger" className="mb-3">
                  {error}
                </CAlert>
              )}

              {/* Loading Spinner */}
              {loading && orders.length === 0 && (
                <div className="text-center py-5">
                  <CSpinner color="primary" />
                  <div className="mt-2">Loading orders...</div>
                </div>
              )}

              {/* Orders Table */}
              <div style={{ position: 'relative' }}>
                {loading && orders.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CSpinner color="primary" />
                  </div>
                )}

                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>Order ID</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Payment</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Delivery</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {orders.map((order) => (
                      <CTableRow key={order.OrderId}>
                        <CTableDataCell>
                          <div>
                            <strong>#{order.OrderId}</strong>
                            <br />
                            <small className="text-muted">
                              {order.payment_type || 'N/A'}
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            {formatDate(order.checkout_date)}
                            {order.min_service_date && (
                              <>
                                <br />
                                <small className="text-muted">
                                  Service: {formatDate(order.min_service_date)}
                                </small>
                              </>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusColor(order.CheckOutStatus)}>
                            {order.CheckOutStatus || 'Pending'}
                          </CBadge>
                          <br />
                          <small className="text-muted">
                            Item: {order.StatusCheck || 'N/A'}
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusColor(order.MainPayStatus)}>
                            {order.MainPayStatus || 'Pending'}
                          </CBadge>
                          <br />
                          <small className="text-muted">
                            {order.pay_category || 'N/A'}
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <strong>
                              {formatCurrency(order.amount || order.total_amount, order.ItemCurrency)}
                            </strong>
                            <br />
                            <small className="text-muted">{order.ItemCurrency || 'USD'}</small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{order.ReqQTy || 1}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusColor(order.deliveryPaidStatus)}>
                            {order.deliveryPaidStatus || 'Pending'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton color="info" variant="ghost" size="sm" className="me-1">
                            View
                          </CButton>
                          <CButton color="warning" variant="ghost" size="sm">
                            Edit
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <CPagination>
                    {paginationItems}
                  </CPagination>
                </div>
              )}

              {/* No Data Message */}
              {!loading && orders.length === 0 && !error && (
                <div className="text-center py-5">
                  <div className="text-muted">No orders found</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default OrdersNew;