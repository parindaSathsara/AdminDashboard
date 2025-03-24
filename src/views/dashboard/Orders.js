/* eslint-disable */

import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import {
  CAvatar,
  CBadge,
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



import { DocsExample } from 'src/components';
import { getAllCardData, getAllDataUserWise, getDashboardOrdersIdWise } from 'src/service/api_calls';
import MaterialTable from 'material-table';
import { Box, Icon, IconButton, MenuItem, ThemeProvider, Tooltip, createTheme } from '@mui/material';

import { Tab, Tabs } from 'react-bootstrap';

import AdditionalData from 'src/Panels/AdditionalData/AdditionalData';
import MailBox from 'src/Panels/MailBox/MailBox';
import AdditionalInfoBox from 'src/Panels/AdditionalInfoBox/AdditionalInfoBox';

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
import FlightOrderView from './FlightUI/FlightOrderView';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import axios from 'axios';
import Scrollbar from 'react-scrollbars-custom';

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

    if (type == "loading") {
      setLoading(true);
    }

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

  // useEffect(() => {
  //   if (newlyAddedColumns.length > 0) {
  //     audio.play();
  //   } else {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   }
  // }, [newlyAddedColumns]);

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

  const [detailPanelExpanded, setDetailPanelExpanded] = useState(false)

  useEffect(() => {

    if (detailPanelExpanded == false) {
      const unsubscribe = onSnapshot(
        collection(db, 'order_ids'),
        (querySnapshot) => {
          if (!querySnapshot.empty) {

            initialDataHandler("realtime");


          } else {
            // console.log("No orders found.");
          }

        },
        (error) => {
          console.error("Error fetching real-time data: ", error);
        }
      );

      return () => unsubscribe();
    }

  }, [detailPanelExpanded])


  const { currencyData, setCurrencyData } = useContext(CurrencyContext);



  const data = useMemo(() => ({
    columns: [

      { accessorKey: 'oid', header: 'Order Id', align: 'left' },
      { accessorKey: 'booking_date', header: 'Booking Date | Time', align: 'left' },
      { accessorKey: 'minServiceDate', header: 'MinService Date', align: 'left' },
      { accessorKey: 'pay_type', header: 'Payment Type', align: 'left' },
      { accessorKey: 'pay_category', header: 'Payment Category', align: 'left' },
      {
        accessorKey: 'refundAmount', header: 'Refunding Amount', align: 'left', Cell: ({ row }) => {

          if (row?.original?.refundAmount > 0) {
            return (
              <>

                <CBadge color="danger" className="ms-2" style={{ fontSize: 14 }}>
                  Refunding {CurrencyConverter(row?.original?.currency, row?.original?.refundAmount, currencyData)}
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
      minServiceDate: value.minServiceDate,
      pay_type: value.payment_type,
      pay_category: value.pay_category,
      total_amount: CurrencyConverter(value.ItemCurrency, value.total_amount, currencyData),
      paid_amount: CurrencyConverter(value.ItemCurrency, value.paid_amount, currencyData),
      discount_amount: CurrencyConverter(value.ItemCurrency, value.discount_price, currencyData),
      delivery_charge: CurrencyConverter(value.ItemCurrency, value.delivery_charge, currencyData),
      additional_data: value.additional_data,
      balance_amount: CurrencyConverter(value.ItemCurrency, value.balance_amount, currencyData),
      refundAmount: (value.refundableAmount || 0.00),
      currency: value.ItemCurrency


    })),
  }), [orderData, currencyData]);


  // refundableAmount


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
    initialState: { expanded: false },
    enableColumnResizing: true,
    muiTableContainerProps: { sx: { maxHeight: '500px' } },
    enableStickyHeader: true,

    // initialState: { pagination: { pageSize: 10 } },
    paginationType: 'stepped',

    paginationPosition: 'both',
    enableExport: true,
    exportOptions: { exportAllData: true, fileName: 'TableData' },
    enableExpandAll: false,

    enableGrouping: true,
    enableColumnActions: true,

    enableStickyFooter: true,
    // initialState: { expanded: false },
    initialState: { expanded: false, columnVisibility: { pay_category: false, pay_type: false, additional_data: false } },
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

    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => {
        const isExpanded = row.getIsExpanded();
        table.setExpanded({ [row.id]: !isExpanded });
        setDetailPanelExpanded(!isExpanded);


        console.log(isExpanded, "Expanded value iss")
      },
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row?.original?.oid ?
        (

          <OrderDetails pageType={"orders"} orderid={row.original.oid} orderData={row?.original} hideStatus={false} updatedData={() => console.log("Updated")} />

        ) : null
  });




  const handleTest = () => {

    for (let index = 0; index < 50; index++) {
      // console.log("first trigger test")
      axios.get(`button_trigger_test`).then(response => {

      })
    }

  }

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
                <h4 id="traffic" className="mb-0">
                  Customer Orders
                </h4>


                {/* <button onClick={handleTest}>Testttt</button> */}
              </CCol>
            </CRow>



            <Tabs defaultActiveKey="group" id="uncontrolled-tab-example" className="mt-4" style={{ fontSize: 16 }} >
              <Tab eventKey="group" title="Group Wise">
                {/* <Scrollbar style={{ width: '100%', height: '40vh' }}> */}
                <MaterialReactTable table={table} />
                {/* </Scrollbar> */}

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
            <OrderDetails pageType={"orders"} dataset={selectedOrderDetails} orderid={selectedOrderDetails.oid} orderData={selectedOrderDetails} hideStatus={false} updatedData={() => console.log("Updated")} />
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
