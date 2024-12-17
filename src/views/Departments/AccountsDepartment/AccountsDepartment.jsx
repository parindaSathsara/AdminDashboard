/* eslint-disable */

import React, { useContext, useEffect, useState } from 'react'
import './AccountsDepartment.css'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormCheck,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from '@coreui/react'
import { CChartLine, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibGmail,

} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import { DocsExample } from 'src/components'
import { getAllCardData, getAllDataUserWise, getDashboardOrdersIdWise } from 'src/service/api_calls'
import MaterialTable from 'material-table'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import ProductDetails from 'src/Panels/ProductDetails/ProductDetails'
import ConfirmationDetails from 'src/Panels/ConfirmationDetails/ConfirmationDetails'
import AccountsDetails from 'src/Panels/AccountsDetails/AccountsDetails'
import SupDetails from 'src/Panels/SupDetails/SupDetails'
import FeebackDetails from 'src/Panels/FeebackDetails/FeebackDetails'
import { Modal, Tab, Tabs } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import PaymentModal from 'src/Panels/PaymentModal/PaymentModal'
import AdditionalData from 'src/Panels/AdditionalData/AdditionalData'
import MailBox from 'src/Panels/MailBox/MailBox'
import AdditionalInfoBox from 'src/Panels/AdditionalInfoBox/AdditionalInfoBox'
import OrderDetailsAccounts from './OrderDetailsAccounts'


import Swal from 'sweetalert2'
import PaymentRejection from './PaymentRejection'
import axios from 'axios'
import { UserLoginContext } from 'src/Context/UserLoginContext';
import LoadingBar from 'react-top-loading-bar'

const Dashboard = () => {
  const { userData } = useContext(UserLoginContext);
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [orderid, setOrderId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentRejection, setPaymentRejection] = useState(false)

  const [showMailModal, setShowMailModal] = useState(false);


  const handleSendMail = (e) => {
    setShowMailModal(true)
    setOrderId(e)
  }






  const defaultMaterialTheme = createTheme();



  const [orderData, setOrderData] = useState([])
  const [cardData, setCardData] = useState({
    orderCount: 0,
    customerCount: 0,
    salesCount: "",
    suppliersCount: 0
  })
  const [orderDataIDWise, setOrderDataIdWise] = useState([])

  useEffect(() => {
    getAllDataUserWise().then(res => {
      console.log(res)
      setOrderData(res)
    })

    getAllCardData().then(res => {
      // console.log(res)
      setCardData(res)
    })
    // setOrderData(getAllDataUserWise());

  }, []);

  const pagePermission = ["all accounts access",
      "view customer orders",
      "approve customer orders",
      "reject customer orders",
      "view customer order pnl",
      "download order long itinerary",
      "download order short itinerary"]

  const data = {
    columns: [
      // {
      //     title: '#ID', field: 'id', align: 'center', editable: 'never',
      // },
      {
        title: 'Order Id', field: 'oid', align: 'left', editable: 'never',
      },
      {
        title: 'Booking Date | Time', field: 'booking_date', align: 'left', editable: 'never',
      },
      {
        title: 'Payment Type', field: 'pay_type', align: 'left', editable: 'never',
      },
      {
        title: 'Payment Category', field: 'pay_category', align: 'left', editable: 'never',
      },
      {
        title: 'Payment Category', field: 'pay_category', align: 'left', editable: 'never',
      },

      {
        title: 'Total Amount', field: 'total_amount', align: 'right', editable: 'never',
      },
      {
        title: 'Paid Amount', field: 'paid_amount', align: 'right', editable: 'never',
      },


      {
        title: 'Discount Amount', field: 'discount_amount', align: 'right', editable: 'never',
      },
      {
        title: 'Delivery Charge', field: 'delivery_charge', align: 'right', editable: 'never',
      },
      {
        title: 'Actions', field: 'actions', align: 'center', editable: 'never',
      },

    ],
    rows: orderData?.map((value, idx) => {
      return {
        // id: value.MainTId,
        data: value,
        oid: value.OrderId,
        booking_date: value.checkout_date,
        pay_type: value.payment_type,
        pay_category: value.pay_category,
        total_amount: value.ItemCurrency + " " + (value.total_amount?.toFixed(2) || "0.00"), // Check for null or undefined
        paid_amount: value.ItemCurrency + " " + (value.paid_amount?.toFixed(2) || "0.00"), // Check for null or undefined
        discount_amount: value.ItemCurrency + " " + (value.discount_price?.toFixed(2) || "0.00"), // Check for null or undefined
        delivery_charge: value.ItemCurrency + " " + (value.delivery_charge?.toFixed(2) || "0.00"), // Check for null or undefined
        actions:
          <div className='actions_box'>
            {/* <NavLink to={"/api/view_order_voucher/" + value.OrderId} target='_blank'><i className='bi bi-printer-fill'></i></NavLink> */}
            {
            (pagePermission.some(permission => userData?.permissions?.includes(permission))) &&
            <button className="btn btn_actions btnViewAction" onClick={(e) => { handleModalOpen(value.OrderId, value) }}>View Order</button>
            }
            </div>
      }
    })
  }




  const [paymentDataSet, setPaymentDataSet] = useState([])

  const handleModalOpen = (value, dataSet) => {

    dataSet["oid"] = value
    setOrderId(value)
    // console.log("Dataaa settttt", dataSet.MainPayStatus)
    setPaymentDataSet(dataSet)
    console.log("Data Set", dataSet)
    setShowModal(true)


    // console.log("Value", value)
  }

  const [progress, setProgress] = useState(0)



  const handleApprovePayment = () => {
    setProgress(0);

    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this payment",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2eb85c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Approve Payment"
    }).then((result) => {
      if (result.isConfirmed) {
        setProgress(25);

        axios.post(`/order/${orderid}/approve-payment`)
          .then(res => {
            setProgress(100);
            setPaymentDataSet({ ...paymentDataSet, MainPayStatus: "Approved" })
            const updatedOrderData = orderData.map(order => 
              order.OrderId === orderid ? { ...order, MainPayStatus: "Approved" } : order
            );
            setOrderData(updatedOrderData);
            Swal.fire({
              title: "Payment Approved!",
              text: res.data.message,
              icon: "success"
            });
          })
          .catch(error => {
            setProgress(100);
            Swal.fire({
              title: "Error While Approving Payment",
              text: error?.response.data.message,
              icon: "error"
            });
          });
      }
    });
  };

  const handleRejectPayment = () => {
    setPaymentRejection(true)

    // Swal.fire({
    //     title: "Are you sure?",
    //     text: "You want to reject this payment",
    //     icon: "question",
    //     showCancelButton: true,
    //     confirmButtonColor: "#979797",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Reject Payment"
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         Swal.fire({
    //             title: "Payment Approved!",
    //             text: "Order - " + orderid + "Payment Approved",
    //             icon: "success"
    //         });
    //     }
    // });
  }


  const handleRejectionSuccess = () =>{
    setPaymentRejection(false)
    setPaymentDataSet({ ...paymentDataSet, MainPayStatus: "Rejected" })
    const updatedOrderData = orderData.map(order => 
      order.OrderId === orderid ? { ...order, MainPayStatus: "Rejected" } : order
    );
    setOrderData(updatedOrderData);
  }

  return (
    <>
      {/* <WidgetsDropdown /> */}
      <LoadingBar color="#58c67d" progress={progress} onLoaderFinished={() => setProgress(0)} height={5} />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="fullscreen"
        aria-labelledby="contained-modal-title-vcenter" >
        <Modal.Header closeButton>

          <Modal.Title>Order Details - {orderid}</Modal.Title>
          {paymentDataSet.MainPayStatus !== "Approved" && paymentDataSet.MainPayStatus !== "Rejected" ? (
            <div className="radioGroup" style={{ marginLeft: "30px" }}>
               {(["all accounts access","approve customer orders"].some(permission => userData?.permissions?.includes(permission))) &&
              <CFormCheck button={{ color: 'success', variant: 'outline' }} type="radio" name="options-outlined" id="success-outlined" autoComplete="off" label="Approve Payment" defaultChecked onClick={handleApprovePayment} />
               }
               {(["all accounts access","reject customer orders"].some(permission => userData?.permissions?.includes(permission))) &&
              <CFormCheck button={{ color: 'danger', variant: 'outline' }} type="radio" name="options-outlined" id="danger-outlined" autoComplete="off" label="Reject Payment" onClick={handleRejectPayment} />
              }
              </div>
          ) : (paymentDataSet.MainPayStatus && paymentDataSet.MainPayStatus === "Rejected") ? (
          <div className="status" style={{ marginLeft: "30px", color: "red", fontWeight: "bold" }}>
            Payment Rejected
          </div>
          
          ): (
            <div className="status" style={{ marginLeft: "30px", color: "green", fontWeight: "bold" }}>
              Payment Approved
            </div>
          )}


        </Modal.Header>

        <Modal.Body className="modalBodyDef">
          <OrderDetailsAccounts orderid={orderid} paymentDataSet={paymentDataSet}></OrderDetailsAccounts>
        </Modal.Body>

        <Modal.Footer className="mainFooterModal">

        </Modal.Footer>
      </Modal >


      <Modal show={paymentRejection} onHide={() => setPaymentRejection(false)} centered size="lg"
        aria-labelledby="contained-modal-title-vcenter" className='modalRejection'>
        <Modal.Header closeButton>

          <Modal.Title>Order Payment Rejection - Order({orderid})</Modal.Title>

        </Modal.Header>

        <Modal.Body className="modalBodyDef">
          <PaymentRejection paymentDataSet={paymentDataSet} orderid={orderid} handleRejectionSuccess={handleRejectionSuccess}></PaymentRejection>
        </Modal.Body>

        <Modal.Footer className="mainFooterModal">

        </Modal.Footer>
      </Modal >


      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Customer Orders
              </h4>
              {/* <div className="small text-medium-emphasis">January - July 2021</div> */}
            </CCol>

          </CRow>







          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              title=""
              // tableRef={tableRef}
              data={data.rows}
              columns={data.columns}


              options={{

                sorting: true, search: true,
                searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                filtering: false, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 10,
                paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                showSelectAllCheckbox: false, showTextRowsSelected: false,
                grouping: true, columnsButton: true,
                headerStyle: { background: '#9f9393', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                rowStyle: { fontSize: "15px", width: "100%", color: "#000" },

                // fixedColumns: {
                //     left: 6
                // }
              }}


            />
          </ThemeProvider>

        </CCardBody>

      </CCard>



    </>
  )
}

export default Dashboard
