/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react'
import './AccountsDepartment.css'
import {
  CCard,
  CCardBody,
  CCol,
  CFormCheck,
  CRow,
} from '@coreui/react'
import { getAllCardData, getAllDataUserWise, getDashboardOrdersIdWise } from 'src/service/api_calls'
import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material'
import { Modal } from 'react-bootstrap'
import OrderDetailsAccounts from './OrderDetailsAccounts'
import PaymentRejection from './PaymentRejection'
import axios from 'axios'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import LoadingBar from 'react-top-loading-bar'
import Swal from 'sweetalert2'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const { userData } = useContext(UserLoginContext)
  const [orderid, setOrderId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [paymentRejection, setPaymentRejection] = useState(false)
  const [orderData, setOrderData] = useState([])
  const [cardData, setCardData] = useState({
    orderCount: 0,
    customerCount: 0,
    salesCount: "",
    suppliersCount: 0
  })
  const [paymentDataSet, setPaymentDataSet] = useState([])
  const [progress, setProgress] = useState(0)

  const defaultMaterialTheme = createTheme()

  useEffect(() => {
    setLoading(true)
    
    const fetchAllData = async () => {
      try {
        // Get initial order data
        const orderRes = await getAllDataUserWise()
        
        // Get detailed data for each order
        const ordersWithDetails = await Promise.all(
          orderRes.map(async (order) => {
            try {
              const detailedData = await getDashboardOrdersIdWise(order.OrderId)
              return {
                ...order,
                detailedData: detailedData
              }
            } catch (error) {
              console.error(`Error fetching details for order ${order.OrderId}:`, error)
              return order // Return original order if details fetch fails
            }
          })
        )
        
        setOrderData(ordersWithDetails)
        
        // Get card data
        const cardRes = await getAllCardData()
        setCardData(cardRes)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [])

  const pagePermission = [
    "all accounts access",
    "view customer orders",
    "approve customer orders",
    "reject customer orders",
    "view customer order pnl",
    "download order long itinerary",
    "download order short itinerary"
  ]

  const data = {
    columns: [
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
        title: 'Refunding Amount', field: 'refunding_amount', align: 'right', editable: 'never',
      },
      {
        title: 'Actions', field: 'actions', align: 'center', editable: 'never', export: false
      },
    ],
    rows: orderData?.map((value) => {
      // Get data from first API
      const mainData = value
      
      // Get data from second API if available
      let paidAmountFromSecondAPI = mainData.paid_amount || 0
      let discountAmount = 0
      
      if (value.detailedData && value.detailedData.lifestyleData && value.detailedData.lifestyleData.length > 0) {
        const lifestyleItem = value.detailedData.lifestyleData[0]
        paidAmountFromSecondAPI = parseFloat(lifestyleItem.paid_amount) || 0
        
        // Calculate discount amount (original total - discounted paid amount)
        const originalTotalAmount = parseFloat(mainData.total_amount) || 0
        discountAmount = originalTotalAmount - paidAmountFromSecondAPI
      }
      
      return {
        data: value,
        oid: value.OrderId,
        booking_date: value.checkout_date,
        pay_type: value.payment_type,
        pay_category: value.pay_category,
        total_amount: value.ItemCurrency + " " + (value.total_amount?.toFixed(2) || "0.00"),
        paid_amount: value.ItemCurrency + " " + (paidAmountFromSecondAPI.toFixed(2) || "0.00"),
        discount_amount: value.ItemCurrency + " " + (discountAmount.toFixed(2) || "0.00"),
        delivery_charge: value.ItemCurrency + " " + (value.delivery_charge?.toFixed(2) || "0.00"),
        refunding_amount: value.ItemCurrency + " " + (value.refundableAmount?.toFixed(2) || "0.00"),
        actions: (
          <div className='actions_box'>
            {(pagePermission.some(permission => userData?.permissions?.includes(permission))) &&
              <button className="btn btn_actions btnViewAction" onClick={() => handleModalOpen(value.OrderId, value)}>
                View Order
              </button>
            }
          </div>
        )
      }
    })
  }

  const handleModalOpen = (value, dataSet) => {
    dataSet["oid"] = value
    setOrderId(value)
    setPaymentDataSet(dataSet)
    setShowModal(true)
  }

  const handleApprovePayment = () => {
    setProgress(0)
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
        setProgress(25)
        axios.post(`/order/${orderid}/approve-payment`)
          .then(res => {
            setProgress(100)
            setPaymentDataSet({ ...paymentDataSet, MainPayStatus: "Approved" })
            const updatedOrderData = orderData.map(order =>
              order.OrderId === orderid ? { ...order, MainPayStatus: "Approved" } : order
            )
            setOrderData(updatedOrderData)
            Swal.fire({
              title: "Payment Approved!",
              text: res.data.message,
              icon: "success"
            })
          })
          .catch(error => {
            setProgress(100)
            Swal.fire({
              title: "Error While Approving Payment",
              text: error?.response.data.message,
              icon: "error"
            })
          })
      }
    })
  }

  const handleRejectPayment = () => {
    setPaymentRejection(true)
  }

  const handleRejectionSuccess = () => {
    setPaymentRejection(false)
    setPaymentDataSet({ ...paymentDataSet, MainPayStatus: "Rejected" })
    const updatedOrderData = orderData.map(order =>
      order.OrderId === orderid ? { ...order, MainPayStatus: "Rejected" } : order
    )
    setOrderData(updatedOrderData)
  }

  return (
    <>
      <LoadingBar color="#58c67d" progress={progress} onLoaderFinished={() => setProgress(0)} height={5} />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="fullscreen">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - {orderid}</Modal.Title>
          {paymentDataSet?.pay_category === "Card Payment" ? (
            null
          ) : (
            paymentDataSet.MainPayStatus !== "Approved" && paymentDataSet.MainPayStatus !== "Rejected" ? (
              <div className="radioGroup" style={{ marginLeft: "30px" }}>
                {(["all accounts access", "approve customer orders"].some(permission => userData?.permissions?.includes(permission))) &&
                  <CFormCheck button={{ color: 'success', variant: 'outline' }} type="radio" name="options-outlined" id="success-outlined" autoComplete="off" label="Approve Payment" defaultChecked onClick={handleApprovePayment} />
                }
                {(["all accounts access", "reject customer orders"].some(permission => userData?.permissions?.includes(permission))) &&
                  <CFormCheck button={{ color: 'danger', variant: 'outline' }} type="radio" name="options-outlined" id="danger-outlined" autoComplete="off" label="Reject Payment" onClick={handleRejectPayment} />
                }
              </div>
            ) : (paymentDataSet.MainPayStatus && paymentDataSet.MainPayStatus === "Rejected") ? (
              <div className="status" style={{ marginLeft: "30px", color: "red", fontWeight: "bold" }}>
                Payment Rejected
              </div>
            ) : (
              <div className="status" style={{ marginLeft: "30px", color: "green", fontWeight: "bold" }}>
                Payment Approved
              </div>
            )
          )}
        </Modal.Header>

        <Modal.Body className="modalBodyDef">
          <OrderDetailsAccounts orderid={orderid} paymentDataSet={paymentDataSet}></OrderDetailsAccounts>
        </Modal.Body>

        <Modal.Footer className="mainFooterModal">
        </Modal.Footer>
      </Modal>

      <Modal show={paymentRejection} onHide={() => setPaymentRejection(false)} centered size="lg" className='modalRejection'>
        <Modal.Header closeButton>
          <Modal.Title>Order Payment Rejection - Order({orderid})</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modalBodyDef">
          <PaymentRejection paymentDataSet={paymentDataSet} orderid={orderid} handleRejectionSuccess={handleRejectionSuccess}></PaymentRejection>
        </Modal.Body>

        <Modal.Footer className="mainFooterModal">
        </Modal.Footer>
      </Modal>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Customer Orders
              </h4>
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading orders data...</p>
            </div>
          ) : (
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialTable
                title=""
                data={data.rows}
                columns={data.columns}
                options={{
                  sorting: true,
                  search: true,
                  searchFieldAlignment: "right",
                  searchAutoFocus: true,
                  searchFieldVariant: "standard",
                  filtering: false,
                  paging: true,
                  pageSizeOptions: [10, 20, 25, 50, 100],
                  pageSize: 10,
                  paginationType: "stepped",
                  showFirstLastPageButtons: false,
                  paginationPosition: "both",
                  exportButton: true,
                  exportAllData: true,
                  exportFileName: "Customer_Orders",
                  addRowPosition: "first",
                  actionsColumnIndex: -1,
                  selection: false,
                  showSelectAllCheckbox: false,
                  showTextRowsSelected: false,
                  grouping: true,
                  columnsButton: true,
                  headerStyle: { background: '#626f75', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                  rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                }}
              />
            </ThemeProvider>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard