import React, { useState, useEffect, useContext } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CWidgetStatsB,
  CPagination,
  CPaginationItem,
  CBadge
} from '@coreui/react';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import LoaderPanel from 'src/Panels/LoaderPanel';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Fullscreen } from '@material-ui/icons';
import DetailExpander from 'src/Panels/OrderDetails/Components/DetailExpander';

const OrdersNew = () => {
  const { currencyData } = useContext(CurrencyContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailExpander, setDetailExpander] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
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

  // Fetch orders data with pagination
  const fetchOrders = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const response = await axios.get('fetch_all_orders_userwise_products', {
        params: {
          page,
          per_page: perPage
        }
      });

      console.log('Fetched Orders:', response.data);
      
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { accessorKey: 'OrderId', header: 'Order ID' },
    { accessorKey: 'checkout_date', header: 'Booking Date' },
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
            accessorKey: 'refundableAmount', header: 'Refunding Amount', align: 'left', Cell: ({ cell }) => {
                console.log("Refund Amount Cell:", cell.getValue());
                console.log("Refund Amount Original:", CurrencyConverter(cell?.original?.currency, cell?.original?.refundableAmount, currencyData));
              if (cell?.getValue() > 0) {
                return (
                  <>
    
                    <CBadge color="danger" className="ms-2" style={{ fontSize: 14 }}>
                      Refunding {CurrencyConverter(cell?.original?.currency, cell?.original?.refundableAmount, currencyData)}
                    </CBadge>
    
                  </>
                )
    
              }
              else {
                return (
                  <p>No Refund Request</p>
                )
              }
    
    
            }
    
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
    enablePagination: false,
    enableRowSelection: false,
    enableColumnActions: true,
    enableColumnFilters: false,
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
        maxHeight: '500px'
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
      fetchOrders(newPage, pagination.perPage);
    }
  };

  if (loading) {
    return <LoaderPanel message="Loading orders..." />;
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <h4>Customer Orders</h4>
              
              {orderData.length > 0 ? (
                <>
                  <MaterialReactTable table={table} />
                  
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <div>
                      Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to{' '}
                      {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of{' '}
                      {pagination.total} entries
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
                </>
              ) : (
                <div className="text-center py-5">
                  No orders found
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {selectedOrderDetails && (
        <DetailExpander
          show={detailExpander}
          onHide={() => setDetailExpander(false)}
          orderid={selectedOrderDetails.OrderId}  // Changed from oid to OrderId
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
        />
      )}
    </>
  );
};

export default OrdersNew;