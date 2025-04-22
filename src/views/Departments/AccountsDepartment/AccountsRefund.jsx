/* eslint-disable */

import React, { useContext, useEffect, useState } from 'react'
import './AccountsDepartment.css'
import {
  CAvatar,
  CBadge,
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
import { getAllCardData, getAllDataUserWise, getAllRefundRequests, getDashboardOrdersIdWise } from 'src/service/api_calls'
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

import LoadingBar from 'react-top-loading-bar'
import CustomerFeedbacks from './CustomerFeedbacks'
import { UserLoginContext } from 'src/Context/UserLoginContext';

const AccountsRefunds = () => {
  const [loading, setLoading] = useState(true);

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

  const closeModel = () => setShowModal(false);




  const defaultMaterialTheme = createTheme();



  const [orderData, setOrderData] = useState([])
  const [cardData, setCardData] = useState({
    orderCount: 0,
    customerCount: 0,
    salesCount: "",
    suppliersCount: 0
  })
  const [orderDataIDWise, setOrderDataIdWise] = useState([])

  const [refundRequests, setRefundRequests] = useState([])

  useEffect(() => {


    getAllRefundRequests().then(res => {
      // console.log("Refund Requests", res)
      setRefundRequests(res)
    })
    // setOrderData(getAllDataUserWise());

  }, []);



  const data = {
    columns: [
      // {
      //     title: '#ID', field: 'id', align: 'center', editable: 'never',
      // },
      {
        title: 'Order Id', field: 'oid', align: 'left', editable: 'never', width: 10
      },
      {
        title: 'Checkout Id', field: 'cid', align: 'left', editable: 'never', width: 10
      },
      {
        title: 'Reason for Refund', field: 'reason_refund', align: 'left', editable: 'never',
      },
      {
        title: 'Payment Type', field: 'pay_type', align: 'left', editable: 'never',
      },
      {
        title: 'Currency', field: 'currency', align: 'left', editable: 'never',
      },
      {
        title: 'Requested Amount', field: 'refund_amount', align: 'left', editable: 'never',
      },
      {
        title: 'Refunded Amount', field: 'refunding_amount', align: 'left', editable: 'never',
      },

      {
        title: 'Refund Status', field: 'status', align: 'center', editable: 'never',
      },

      {
        title: 'Actions', field: 'actions', align: 'center', editable: 'never',
      }
    ],
    rows: refundRequests?.map((value, idx) => {
      return {
        refunding_amount: value.refunding_amount,
        type: value.refund_type,
        oid: value.order_id,
        cid: value.checkout_id,
        reason_refund: value.reason_for_refund,
        refund_amount: value.total_amount,
        pay_type: value.pay_category,
        currency: value.currency,
        status: value.refund_type,
        actions:
          value.refund_type == "" || value.refund_type == null ?
            <div className='actions_box'>
              {(["all accounts access", "view refund customer request", "confirm refund customer request"].some(permission => userData?.permissions?.includes(permission))) &&
                <button className="btn btn_actions btnViewAction" onClick={(e) => { handleModalOpen(value.checkout_id, value) }}>View Refund</button>
              }
            </div>
            :

            <div className='actions_box'>

              <button className="btn btn_actions btnViewAction" onClick={(e) => { handleModalOpen(value.checkout_id, value) }} disabled style={{ fontSize: 12 }}>Refund Process Completed</button>
            </div>


      }
    })
  }




  const [refundDataSet, setRefundDataSet] = useState([])

  const handleModalOpen = (value, dataSet) => {

    setOrderId(value)
    setRefundDataSet(dataSet)
    setShowModal(true)


    // console.log("Value", value)
  }

  const [progress, setProgress] = useState(0)

  const [refundCustomerData, setRefundCustomerData] = useState([])


  const handleRejectPayment = () => {
    setPaymentRejection(true)

    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this refund",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#979797",
      cancelButtonColor: "#d33",
      confirmButtonText: "Reject Payment"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Payment Approved!",
          text: "Order - " + orderid + "Payment Approved",
          icon: "success"
        });
      }
    });
  }

  const handleFeedback = () => {
    getAllRefundRequests().then(res => {
      setRefundRequests(res)
    })
  }



  return (
    <>
      {/* <WidgetsDropdown /> */}
      <LoadingBar color="#58c67d" progress={progress} onLoaderFinished={() => setProgress(0)} height={5} />


      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="fullscreen"
        aria-labelledby="contained-modal-title-vcenter" >
        <Modal.Header closeButton>

          <Modal.Title>Refund Details</Modal.Title>

        </Modal.Header>

        <Modal.Body className="modalBodyDef">
          <CustomerFeedbacks closeModel={closeModel} orderId={orderid} orderValue={refundDataSet} onFeedback={handleFeedback}></CustomerFeedbacks>
        </Modal.Body>

        <Modal.Footer className="mainFooterModal">

        </Modal.Footer>
      </Modal >

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="mb-0">
                Refund Requests
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
                headerStyle: { background: '#626f75', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                rowStyle: rowData => ({
                  fontSize: "15px",
                  width: "100%",
                  color: "#000",
                  backgroundColor: rowData.type == "Reject Refund Request" ? "#ff8367" : ''
                }),

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

export default AccountsRefunds
