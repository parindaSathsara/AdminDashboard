import React, { useState, useEffect, useContext } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CPagination,
  CPaginationItem,
  CBadge,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton
} from '@coreui/react';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import LoaderPanel from 'src/Panels/LoaderPanel';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit, Search, Clear } from '@material-ui/icons';
import DetailExpander from 'src/Panels/OrderDetails/Components/DetailExpander';
import ProductWiseOrders from './MainComponents/ProductWiseOrders';
import { Tab, Tabs } from 'react-bootstrap';
import ProductWiseOrdersPaginate from './MainComponents/ProductWiseOrdersPaginate';

const OrdersNew = () => {
  const { currencyData } = useContext(CurrencyContext);
  console.log(currencyData, "Currency Data in OrdersNew");
  const [activeTab, setActiveTab] = useState('group');
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailExpander, setDetailExpander] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTableFullscreen, setIsTableFullscreen] = useState(false); // Added fullscreen state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1
  });

  const handleFullScreen = (rowData) => {
    setSelectedOrderDetails(rowData);
    setDetailExpander(true);
  };

  // Toggle table fullscreen
  const toggleTableFullscreen = () => {
    setIsTableFullscreen(!isTableFullscreen);
  };

  // Fetch orders data with pagination and search
  const fetchOrders = async (page = 1, perPage = 10, search = '') => {
    try {
      !isTableFullscreen && setLoading(true);
      const response = await axios.get('fetch_all_orders_userwise_products', {
        params: {
          page,
          per_page: perPage,
          search
        }
      });

      if (response.data.success) {
        setOrderData(response.data.data);
        setPagination({
          currentPage: response.data.meta.current_page,
          perPage: response.data.meta.per_page,
          total: response.data.meta.total,
          lastPage: response.data.meta.last_page
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      // If search term is empty, fetch all orders
      fetchOrders();
    } else {
      // If search term exists, fetch with search
      fetchOrders(1, pagination.perPage, searchTerm);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchOrders(); // Fetch all orders when clearing search
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { accessorKey: 'OrderId', header: 'Order ID' },
    { accessorKey: 'checkout_date', header: 'Booking Date' },
    {
      accessorKey: 'refundableAmount',
      header: 'Refunding Amount',
      align: 'left',
      Cell: ({ cell }) => {
        if (cell?.getValue() > 0) {
          console.log(cell, "Refundable Amount");
          return (
            <CBadge color="danger" className="ms-2" style={{ fontSize: 14 }}>
              Refunding {CurrencyConverter(currencyData.base, cell.getValue(), currencyData)}
            </CBadge>
          )
        } else {
          return <p>No Refund Request</p>
        }
      }
    },
    { accessorKey: 'min_service_date', header: 'Service Date' },
    {
      accessorKey: 'payment_type',
      header: 'Payment Type',
      Cell: ({ cell }) => (
        <span style={{
          color: cell.getValue() === 'paid' ? 'green' : 'orange',
          fontWeight: 'bold'
        }}>
          {cell.getValue()}
        </span>
      )
    },
    {
      accessorKey: 'total_amount',
      header: 'Total Amount',
      Cell: ({ row }) => (
        <span>
          {CurrencyConverter(
            row.original.ItemCurrency,
            row.original.total_amount,
            currencyData
          )}
        </span>
      )
    },
    {
      accessorKey: 'paid_amount',
      header: 'Paid Amount',
      Cell: ({ row }) => (
        <span>
          {CurrencyConverter(
            row.original.ItemCurrency,
            row.original.paid_amount,
            currencyData
          )}
        </span>
      )
    },
    {
      accessorKey: 'balance_amount',
      header: 'Balance',
      Cell: ({ row }) => (
        <span style={{
          color: row.original.balance_amount > 0 ? 'red' : 'green'
        }}>
          {CurrencyConverter(
            row.original.ItemCurrency,
            row.original.balance_amount,
            currencyData
          )}
        </span>
      )
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: orderData,
    enableFullScreenToggle:false, // if this prop is present
    enablePagination: false,
    enableRowSelection: false,
    enableColumnActions: true,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableSorting: true,
    initialState: {
      density: 'compact'
    },
    renderDetailPanel: ({ row }) => (
      <div style={{ padding: '20px' }}>
        <OrderDetails
          pageType="orders"
          orderid={row.original.OrderId}
          orderData={row.original}
          hideStatus={false}
        />
      </div>
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: isTableFullscreen ? '100vh' : '500px' // Dynamic height based on fullscreen state
      }
    },
    // Removed row actions since you don't want fullscreen in action column
     enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Full Screen">
          <IconButton onClick={() => handleFullScreen(row.original)}>
            <Fullscreen />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchOrders(newPage, pagination.perPage, searchTerm);
    }
  };

  if (loading) {
    return <LoaderPanel message="Loading orders..." />;
  }

  // Fullscreen container styles
  const containerStyle = isTableFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1030,
        backgroundColor: 'white',
        padding: '20px',
        overflow: 'auto',
      }
    : {}

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <div style={containerStyle}>
            <CCard className="mb-4">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Customer Orders</h4>
                  <div className="d-flex align-items-center gap-3">
                    {activeTab === "group" && (
                      <>
                        <CInputGroup style={{ width: '300px' }}>
                          <CFormInput
                            placeholder="Search by Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          {searchTerm && (
                            <CButton
                              color="secondary"
                              onClick={handleClearSearch}
                              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            >
                              <Clear />
                            </CButton>
                          )}
                          <CButton
                            color="primary"
                            onClick={handleSearch}
                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                          >
                            <Search />
                          </CButton>
                        </CInputGroup>

                        {/* Table Fullscreen Toggle Button */}
                        <Tooltip title={isTableFullscreen ? "Exit Fullscreen" : "Click Fullscreen"}>
                          <IconButton
                            onClick={toggleTableFullscreen}
                            color="primary"
                            size="large"
                          >
                            {isTableFullscreen ? <FullscreenExit /> : <Fullscreen />}
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>

                <Tabs
                  defaultActiveKey="group"
                  id="orders-view-tabs"
                  className="mt-4"
                  style={{ fontSize: 16 }}
                  activeKey={activeTab}
                  onSelect={handleTabSelect}
                >
                  <Tab eventKey="group" title="Group Wise">
                    {orderData.length > 0 ? (
                      <>
                        <MaterialReactTable table={table} />

                        {/* Hide pagination when in fullscreen mode */}
                        {
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <div>
                              Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to{' '}
                              {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of{' '}
                              {pagination.total} entries
                              {searchTerm && (
                                <span className="ms-2 text-muted">
                                  (Filtered by: "{searchTerm}")
                                </span>
                              )}
                            </div>

                            <CPagination aria-label="Page navigation">
                              <CPaginationItem
                                disabled={pagination.currentPage === 1}
                                onClick={() => handlePageChange(1)}
                              >
                                First
                              </CPaginationItem>
                              <CPaginationItem
                                disabled={pagination.currentPage === 1}
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                              >
                                Previous
                              </CPaginationItem>

                              {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                                let pageNum;
                                if (pagination.lastPage <= 5) {
                                  pageNum = i + 1;
                                } else if (pagination.currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (pagination.currentPage >= pagination.lastPage - 2) {
                                  pageNum = pagination.lastPage - 4 + i;
                                } else {
                                  pageNum = pagination.currentPage - 2 + i;
                                }

                                return (
                                  <CPaginationItem
                                    key={pageNum}
                                    active={pageNum === pagination.currentPage}
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </CPaginationItem>
                                );
                              })}

                              <CPaginationItem
                                disabled={pagination.currentPage === pagination.lastPage}
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                              >
                                Next
                              </CPaginationItem>
                              <CPaginationItem
                                disabled={pagination.currentPage === pagination.lastPage}
                                onClick={() => handlePageChange(pagination.lastPage)}
                              >
                                Last
                              </CPaginationItem>
                            </CPagination>
                          </div>
                        }
                      </>
                    ) : (
                      <div className="text-center py-5">
                        {searchTerm ? 'No orders found matching your search' : 'No orders found'}
                      </div>
                    )}
                  </Tab>
                  <Tab eventKey="product" title="Product Wise">
                    <ProductWiseOrdersPaginate />
                  </Tab>
                </Tabs>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
      </CRow>

      {selectedOrderDetails && (
        <DetailExpander
          show={detailExpander}
          onHide={() => setDetailExpander(false)}
          orderid={selectedOrderDetails.OrderId}
          component={
            <OrderDetails
              pageType="orders"
              dataset={selectedOrderDetails}
              orderid={selectedOrderDetails.OrderId}
              orderData={selectedOrderDetails}
              hideStatus={false}
              updatedData={() => console.log("Updated")}
            />
          }
          style={isTableFullscreen ? { zIndex: 100000 } : {}}
        />
      )}
    </>
  );
};

export default OrdersNew;
