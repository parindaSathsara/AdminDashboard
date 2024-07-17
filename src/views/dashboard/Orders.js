/* eslint-disable */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from '@coreui/react';
import { CChartLine, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import CIcon from '@coreui/icons-react';
import {
  cibGmail,
  cibFilezilla,
  cilNoteAdd,
  cilViewModule,
  cilViewColumn,
  cilViewStream
} from '@coreui/icons';

import avatar1 from 'src/assets/images/avatars/1.jpg';
import avatar2 from 'src/assets/images/avatars/2.jpg';
import avatar3 from 'src/assets/images/avatars/3.jpg';
import avatar4 from 'src/assets/images/avatars/4.jpg';
import avatar5 from 'src/assets/images/avatars/5.jpg';
import avatar6 from 'src/assets/images/avatars/6.jpg';

import WidgetsBrand from '../widgets/WidgetsBrand';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import { DocsExample } from 'src/components';
import { getAllCardData, getAllDataUserWise, getDashboardOrdersIdWise } from 'src/service/api_calls';
import MaterialTable from 'material-table';
import { Box, Icon, IconButton, MenuItem, ThemeProvider, Tooltip, createTheme } from '@mui/material';

import { Tab, Tabs } from 'react-bootstrap';

import AdditionalData from 'src/Panels/AdditionalData/AdditionalData';
import MailBox from 'src/Panels/MailBox/MailBox';
import AdditionalInfoBox from 'src/Panels/AdditionalInfoBox/AdditionalInfoBox';
import Cards from '../base/cards/Cards';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';

import { io } from 'socket.io-client';
import productSound from '../../assets/productSound.mp3';
import ProductWiseOrders from './MainComponents/ProductWiseOrders';
import LoaderPanel from 'src/Panels/LoaderPanel';
import DetailExpander from 'src/Panels/OrderDetails/Components/DetailExpander';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Expand, ExpandCircleDown, ExpandCircleDownSharp } from '@mui/icons-material';
import { Fullscreen } from '@material-ui/icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'src/firebase';

const Orders = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const [orderid, setOrderId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showMailModal, setShowMailModal] = useState(false);
  const [showAddtitionalModal, setShowAdditionalModal] = useState(false);
  const [rowDetails, setRowDetails] = useState([]);
  const [newlyAddedColumns, setNewlyAddedColumns] = useState([]);

  const handleSendMail = (e) => {
    setShowMailModal(true);
    setOrderId(e);
  };

  const handleAdditionalModal = (e) => {
    setShowModalAdd(true);
    setOrderId(e);
  };

  const handleAdditionalInfoModal = (e) => {
    setShowAdditionalModal(true);
    setOrderId(e);
  };

  const defaultMaterialTheme = createTheme();

  const [orderData, setOrderData] = useState([]);
  const [cardData, setCardData] = useState({
    orderCount: 0,
    customerCount: 0,
    salesCount: "",
    suppliersCount: 0
  });

  useEffect(() => {
    initialDataHandler("loading");
  }, []);

  const initialDataHandler = (type) => {


    if (type == "loading") {
      setLoading(true);
    }


    getAllDataUserWise().then(res => {
      setOrderData(res);
      setLoading(false);
    });

    setLoading(true);

    getAllCardData().then(res => {
      setCardData(res);
      setLoading(false);
    });
  };

  const rowStyle = (rowData) => {
    const isRowNewlyAdded = newlyAddedColumns.length > 0 && newlyAddedColumns.includes(rowData.oid);

    return {
      fontSize: isRowNewlyAdded ? "17px" : "15px",
      width: "100%",
      color: isRowNewlyAdded ? "#002c4a" : "#000",
      fontWeight: isRowNewlyAdded ? 'normal' : 'normal',
      backgroundColor: isRowNewlyAdded ? '#bfe5ff' : 'white',
    };
  };

  const [audio] = useState(new Audio(productSound));

  useEffect(() => {
    if (newlyAddedColumns.length > 0) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [newlyAddedColumns]);

  const changedRowHandler = (changedRow) => {
    const newlyAddedColumn = changedRow?.lastId;
    getAllDataUserWise().then(res => {
      setOrderData(res);

      if (newlyAddedColumn) {
        setNewlyAddedColumns([...newlyAddedColumns, newlyAddedColumn]);

        setTimeout(() => {
          setNewlyAddedColumns([]);
        }, 6000);
      }
    });

    getAllCardData().then(res => {
      setCardData(res);
    });
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'order_ids'),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          initialDataHandler("realtime");
        } else {
          console.log("No orders found.");
        }

      },
      (error) => {
        console.error("Error fetching real-time data: ", error);
      }
    );

    return () => unsubscribe();

  }, [])


  const data = useMemo(() => ({
    columns: [

      { accessorKey: 'oid', header: 'Order Id', align: 'left' },



      { accessorKey: 'booking_date', header: 'Booking Date | Time', align: 'left' },
      { accessorKey: 'pay_type', header: 'Payment Type', align: 'left' },
      { accessorKey: 'pay_category', header: 'Payment Category', align: 'left' },
      { accessorKey: 'total_amount', header: 'Total Amount', align: 'right' },
      { accessorKey: 'paid_amount', header: 'Paid Amount', align: 'right' },
      { accessorKey: 'balance_amount', header: 'Balance Amount', align: 'right' },
      { accessorKey: 'discount_amount', header: 'Discount Amount', align: 'right' },
      { accessorKey: 'delivery_charge', header: 'Delivery Charge', align: 'right' },
      {
        accessorKey: 'additional_data',
        header: 'Additional Information',
        align: 'center',
        Cell: ({ row }) => (
          <>
            <button
              className="btn btn-primary btn_aditional_data btn-sm"
              onClick={() => handleAdditionalModal(row.original.oid)}
            >
              <CIcon icon={cilNoteAdd} size="sm" />
            </button>{' '}
            |{' '}
            <button
              type="button"
              className="btn btn-info view_upload_info btn-sm"
              onClick={() => handleAdditionalInfoModal(row.original.oid)}
            >
              <CIcon icon={cilViewStream} size="sm" />
            </button>
          </>
        ),
      },
    ],
    rows: orderData.map((value) => ({

      oid: value.OrderId,
      booking_date: value.checkout_date,
      pay_type: value.payment_type,
      pay_category: value.pay_category,
      total_amount: value.ItemCurrency + ' ' + (value.total_amount || '0.00'),
      paid_amount: value.ItemCurrency + ' ' + (value.paid_amount || '0.00'),
      discount_amount: value.ItemCurrency + ' ' + (value.discount_price || '0.00'),
      delivery_charge: value.ItemCurrency + ' ' + (value.delivery_charge || '0.00'),
      additional_data: value.additional_data,
      balance_amount: value.ItemCurrency + ' ' + (value.balance_amount || '0.00'),
    })),
  }), [orderData]);

  const [tabIndex, setTabIndex] = useState("");

  const tableRef = useRef();

  useEffect(() => {
    // handle any required updates
  }, []);

  const handleChange = (e) => {
    // handle change
  };

  const [detailExpander, setDetailExpander] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);


  const handleFullScreen = (rowData) => {
    setSelectedOrderDetails(rowData)
    setDetailExpander(true)
  }

  const table = useMaterialReactTable({
    columns: data.columns,
    data: data.rows,
    enableSorting: true,
    enableGlobalFilter: true,
    globalFilterAlign: 'right',
    globalFilterAutoFocus: true,
    globalFilterVariant: 'standard',
    enableFilters: true,
    enablePagination: true,
    pageSizes: [20, 25, 50, 100],
    initialState: { pagination: { pageSize: 10 } },
    paginationType: 'stepped',

    paginationPosition: 'both',
    enableExport: true,
    exportOptions: { exportAllData: true, fileName: 'TableData' },
    enableExpandAll: false,

    enableGrouping: true,
    enableColumnActions: true,
    initialState: { expanded: false },

    defaultColumn: {
      headerStyle: {
        background: '#070e1a',
        color: '#fff',
        padding: '15px',
        fontSize: '17px',
        fontWeight: '500',
      },
      cellStyle: {},
    },
    enableRowActions: true,

    renderRowActions: ({ row }) => [
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Full Screen">
          <IconButton onClick={() => handleFullScreen(row?.original)}>
            <Fullscreen />
          </IconButton>
        </Tooltip>

      </Box>
    ],


    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor: 'white'
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row?.original?.oid ?
        (

          <OrderDetails orderid={row.original.oid} orderData={row?.original} hideStatus={false} updatedData={() => console.log("Updated")} />

        ) : null
  });

  if (loading) {
    return <LoaderPanel message={"Data processing in progress"} />;
  } else {
    return (
      <>
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
              value={cardData.salesCount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ""}
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

        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="traffic" className="card-title mb-0">
                  Customer Orders
                </h4>
              </CCol>
            </CRow>

            <Tabs
              defaultActiveKey="group"
              id="uncontrolled-tab-example"
              className="mt-4"
              style={{ fontSize: 16 }}
            >
              <Tab eventKey="group" title="Group Wise">
                <MaterialReactTable
                  table={table}

                />
              </Tab>
              <Tab eventKey="product" title="Product Wise">
                <ProductWiseOrders />
              </Tab>
            </Tabs>
          </CCardBody>
        </CCard>

        <DetailExpander
          show={detailExpander}
          onHide={() => setDetailExpander(false)}
          orderid={selectedOrderDetails.oid}
          component={
            <OrderDetails dataset={selectedOrderDetails} orderid={selectedOrderDetails.oid} orderData={selectedOrderDetails} hideStatus={false} updatedData={() => console.log("Updated")} />
          }
        />

        {showModalAdd && (
          <AdditionalData
            show={showModalAdd}
            onHide={() => setShowModalAdd(false)}
            orderid={orderid}
          />
        )}

        {showMailModal && (
          <MailBox
            show={showMailModal}
            onHide={() => setShowMailModal(false)}
            orderid={orderid}
          />
        )}

        {showAddtitionalModal && (
          <AdditionalInfoBox
            show={showAddtitionalModal}
            onHide={() => setShowAdditionalModal(false)}
            orderid={orderid}
          />
        )}
      </>
    );
  }
};

export default Orders;
