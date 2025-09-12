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
  CButton,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilNoteAdd, cilViewStream } from '@coreui/icons';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import LoaderPanel from 'src/Panels/LoaderPanel';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit, Search, Clear } from '@mui/icons-material';
import DetailExpander from 'src/Panels/OrderDetails/Components/DetailExpander';
import { Tab, Tabs } from 'react-bootstrap';
import ProductWiseOrdersPaginate from './MainComponents/ProductWiseOrdersPaginate';
import AdditionalData from 'src/Panels/AdditionalData/AdditionalData';
import AdditionalInfoBox from 'src/Panels/AdditionalInfoBox/AdditionalInfoBox';

const OrdersNew = () => {
  const { currencyData } = useContext(CurrencyContext);
  const [activeTab, setActiveTab] = useState('group');
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailExpander, setDetailExpander] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1
  });
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showAdditionalModal, setShowAdditionalModal] = useState(false);
  const [orderid, setOrderId] = useState(null);

  const handleAdditionalModal = (id) => {
    setOrderId(id);
    setShowModalAdd(true);
  };

  const handleAdditionalInfoModal = (id) => {
    setOrderId(id);
    setShowAdditionalModal(true);
  };

  const handleFullScreen = (rowData) => {
    setSelectedOrderDetails(rowData);
    setDetailExpander(true);
  };

  const toggleTableFullscreen = () => {
    setIsTableFullscreen(!isTableFullscreen);
  };

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

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchOrders();
    } else {
      fetchOrders(1, pagination.perPage, searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchOrders();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getRefundBadge = (row) => {
  const refundAmount = row.original.refundableAmount;
  const refundStatus = row.original.refundStatus;
  const hasRefundRequest = row.original.hasRefundRequest;
  const currency = row.original.ItemCurrency;

  // If no refund request, show "No Refund Request"
  if (!hasRefundRequest) {
    return (
      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
        No Refund Request
      </span>
    );
  }

  // If refund is completed (status 1)
  if (refundStatus === 1) {
    return (
      <CBadge color="danger" style={{ fontSize: 14, padding: '4px 8px' }}>
        Refunded: {CurrencyConverter(currency, refundAmount, currencyData)}
      </CBadge>
    );
  }

  // If refund is in process (any other status)
  return (
    <CBadge color="warning" style={{ fontSize: 14, padding: '4px 8px' }}>
      Refunding: {CurrencyConverter(currency, refundAmount, currencyData)}
    </CBadge>
  );
};

  const columns = [
    { 
      accessorKey: 'OrderId', 
      header: 'Order ID',
      muiTableHeadCellProps: {
        sx: { minWidth: '120px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '120px', maxWidth: '150px', whiteSpace: 'nowrap' },
      },
    },
    {
      accessorKey: 'checkout_date',
      header: 'Booking Date',
      muiTableHeadCellProps: {
        sx: { minWidth: '150px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '150px', maxWidth: '180px', whiteSpace: 'nowrap' },
      },
    },
    {
      accessorKey: 'refundableAmount',
      header: 'Refund Status',
      muiTableHeadCellProps: {
        sx: { minWidth: '200px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '200px', maxWidth: '250px', whiteSpace: 'nowrap' },
      },
      align: 'left',
      Cell: ({ row }) => getRefundBadge(row)
    },
    {
      accessorKey: 'min_service_date', 
      header: 'Service Date', 
      muiTableHeadCellProps: {
        sx: { minWidth: '150px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '150px', maxWidth: '180px', whiteSpace: 'nowrap' },
      },
    },
    {
      accessorKey: 'payment_type',
      header: 'Payment Type',
      muiTableHeadCellProps: {
        sx: { minWidth: '150px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '150px', maxWidth: '180px', whiteSpace: 'nowrap' },
      },
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
      muiTableHeadCellProps: {
        sx: { minWidth: '150px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '150px', maxWidth: '180px', whiteSpace: 'nowrap' },
      },
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
      muiTableHeadCellProps: {
        sx: { minWidth: '150px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '150px', maxWidth: '180px', whiteSpace: 'nowrap' },
      },
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
      muiTableHeadCellProps: {
        sx: { minWidth: '120px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '120px', maxWidth: '150px', whiteSpace: 'nowrap' },
      },
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
    {
      accessorKey: 'additional_data',
      header: 'Additional Information',
      muiTableHeadCellProps: {
        sx: { minWidth: '180px' },
      },
      muiTableBodyCellProps: {
        sx: { minWidth: '180px', maxWidth: '200px', whiteSpace: 'nowrap' },
      },
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleAdditionalModal(row.original.OrderId)}
          >
            <CIcon icon={cilNoteAdd} size="sm" />
          </button>
          <button
            className="btn btn-info btn-sm"
            onClick={() => handleAdditionalInfoModal(row.original.OrderId)}
          >
            <CIcon icon={cilViewStream} size="sm" />
          </button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: orderData,
    enableFullScreenToggle: false,
    enablePagination: false,
    enableRowSelection: false,
    enableColumnActions: true,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableSorting: true,
    enableGrouping: true,
    initialState: {
      density: 'compact'
    },
    muiTablePaperProps: {
      sx: {
        overflow: 'visible',
      }
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
    muiTableHeadCellProps: ({ column }) => ({
      title: column.getIsSorted()
        ? `Sort by ${column.columnDef.header} ${column.getIsSorted() === 'asc' ? '(Ascending)' : '(Descending)'}`
        : `Sort by ${column.columnDef.header}`,
      sx: {
        '&:hover': {
          cursor: column.getCanSort() ? 'pointer' : 'default',
        },
        position: 'relative',
        overflow: 'visible !important',
        '& .MuiButton-root': {
          position: 'relative',
          zIndex: 11,
        }
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: isTableFullscreen ? '100vh' : '500px',
        overflow: 'auto',
        position: 'relative',
        '& .MuiTableHead-root': {
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: '#f8f9fa',
        },
        '& .MuiTableHead-root .MuiTableCell-head': {
          backgroundColor: '#f8f9fa',
          position: 'relative',
          overflow: 'visible !important',
        },
        '& .MuiTooltip-popper': {
          zIndex: 10000,
          '& .MuiTooltip-tooltip': {
            position: 'relative',
            zIndex: 10001,
          }
        }
      }
    },
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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.lastPage, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    items.push(
      <CPaginationItem 
        key="prev"
        disabled={pagination.currentPage === 1}
        onClick={() => handlePageChange(pagination.currentPage - 1)}
      >
        Previous
      </CPaginationItem>
    );
    
    if (startPage > 1) {
      items.push(
        <CPaginationItem
          key={1}
          active={1 === pagination.currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </CPaginationItem>
      );
      
      if (startPage > 2) {
        items.push(<CPaginationItem key="ellipsis1" disabled>...</CPaginationItem>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <CPaginationItem
          key={i}
          active={i === pagination.currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }
    
    if (endPage < pagination.lastPage) {
      if (endPage < pagination.lastPage - 1) {
        items.push(<CPaginationItem key="ellipsis2" disabled>...</CPaginationItem>);
      }
      
      items.push(
        <CPaginationItem
          key={pagination.lastPage}
          active={pagination.lastPage === pagination.currentPage}
          onClick={() => handlePageChange(pagination.lastPage)}
        >
          {pagination.lastPage}
        </CPaginationItem>
      );
    }
    
    items.push(
      <CPaginationItem 
        key="next"
        disabled={pagination.currentPage === pagination.lastPage}
        onClick={() => handlePageChange(pagination.currentPage + 1)}
      >
        Next
      </CPaginationItem>
    );
    
    return items;
  };

  if (loading) {
    return <LoaderPanel message="Loading orders..." />;
  }

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
    : {};

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
                          <div className="d-flex align-items-center flex-wrap gap-2">
                            <div className="d-flex align-items-center">
                              <span className="me-2">Items per page:</span>
                              <CFormSelect
                                value={pagination.perPage}
                                onChange={(e) => {
                                  const newPerPage = parseInt(e.target.value);
                                  fetchOrders(1, newPerPage, searchTerm);
                                }}
                                style={{ width: '80px' }}
                              >
                                {[10, 20, 50, 100].map((size) => (
                                  <option key={size} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </CFormSelect>
                            </div>

                            <CPagination aria-label="Page navigation" className="m-0">
                              {renderPaginationItems()}
                            </CPagination>
                          </div>
                        </div>
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
          style={isTableFullscreen ? {
            zIndex: 100000,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          } : {}}
        />
      )}
      {showModalAdd && (
        <AdditionalData
          show={showModalAdd}
          onHide={() => setShowModalAdd(false)}
          orderid={orderid}
        />
      )}

      {showAdditionalModal && (
        <AdditionalInfoBox
          show={showAdditionalModal}
          onHide={() => setShowAdditionalModal(false)}
          orderid={orderid}
        />
      )}
    </>
  );
};

export default OrdersNew;