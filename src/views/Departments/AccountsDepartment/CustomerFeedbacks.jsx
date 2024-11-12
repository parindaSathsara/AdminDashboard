import MaterialTable from 'material-table'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import { useEffect, useState } from 'react';
import { getAllFeedbacks, getAllRefundRequests } from 'src/service/api_calls';
import { GoStarFill } from "react-icons/go";
import axios from 'axios';
import { CCol, CFormCheck, CFormInput, CFormLabel, CFormSelect, CImage, CRow } from '@coreui/react';
import Swal from 'sweetalert2';
function CustomerFeedbacks(props) {


  const defaultMaterialTheme = createTheme();


  const [feedbacks, setFeedbacks] = useState([])

  const [orderData, setOrderData] = useState([])
  const [product, setProduct] = useState({})
  const [visibleRefund, setVisibleRefund] = useState(false);

  useEffect(() => {


    getAllFeedbacks(props.orderId).then(res => {
      setFeedbacks(res[0])
      setProduct(res[1])
      // console.log("Feedbacks are".res)
    })

    setOrderData(props.orderValue)


    // console.log(props.orderValue, "Order Value")

    // setOrderData(getAllDataUserWise());

  }, [props.orderValue]);

  const data = {
    columns: [
      // {
      //     title: '#ID', field: 'id', align: 'center', editable: 'never',
      // },
      {
        title: 'Rating', field: 'rating', align: 'left', editable: 'never', width: 10
      },
      {
        title: 'Feedback Reason', field: 'feedback_reason', align: 'left', editable: 'never',
      },
      {
        title: 'Product Review', field: 'review_product', align: 'left', editable: 'never',
      },
      {
        title: 'Image', field: 'review_images', align: 'left', editable: 'never',
      },

    ],
    rows: feedbacks?.map((value, idx) => {
      return {
        // id: value.MainTId,
        rating: <div style={{ display: 'flex', flexDirection: 'row' }}>

          {[...Array(value.rating)].map((_, index) => (
            <GoStarFill size={25} color='#FFB900' style={{ padding: 1 }} />
          ))}


        </div>,
        feedback_reason: value.feedback_reason,
        review_product: value.review_product,
        review_images: <a target="_blank" href={axios.defaults.data + "/" + value['review_images']}>
          <img src={axios.defaults.data + "/" + value['review_images']} width="250"
            height="120"
            style={{ objectFit: 'cover', width: 100 }} />
        </a>,

      }
    })
  }




  const [refundCustomerData, setRefundCustomerData] = useState({
    refunding_amount: 0.00,
    refund_type: "",
    refund_status: false,
    requestAmount: 0.00
  })

  const handleApprovePayment = () => {
    if (!refundCustomerData.refund_type) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select refund type!",
      });
      return;
    }

    if (parseFloat(refundCustomerData.refunding_amount) > parseFloat(refundCustomerData.requestAmount) || parseFloat(refundCustomerData.refunding_amount) < 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter valid refund amount!",
      });
      return;
    }

    if (refundCustomerData.refund_type == "Partial Refund" && (parseFloat(refundCustomerData.refunding_amount) >= parseFloat(refundCustomerData.requestAmount) || parseFloat(refundCustomerData.refunding_amount) == 0)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter valid refund amount!",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to apply this changes",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2eb85c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {

        // console.log(refundCustomerData, "Refund")
        const dataSet = {
          refund_status: refundCustomerData.refund_status,
          refund_type: refundCustomerData.refund_type,
          refunding_amount: refundCustomerData.refunding_amount,
        }

        // console.log("Dataset", dataSet)

        try {
          axios.post(`/approveRefund/${props.orderId}`, dataSet).then(res => {
            if (res.data.status === 200) {
              props.onFeedback()
              Swal.fire({
                title: "Payment Confirmed!",

                icon: "success"
              });

            } else {
              alert('something got mistake')
            }
          })
        } catch (error) {

          Swal.fire({
            title: "Error While Refunding",
            icon: "error"
          });
          throw new Error(error)
        }

      }
    });

    // // console.log("handle approve payment")
    // // console.log("Handle Approve Payment")

  }


  const handleFormData = (e) => {

    if (e.target.name == "refund_type") {
      switch (e.target.value) {
        case "Full Refund":
          setVisibleRefund(false);
          setRefundCustomerData({ refundCustomerData, refund_type: e.target.value, refunding_amount: orderData.total_amount, requestAmount: orderData.total_amount, refund_status: true })
          break;
        case "Reject Refund Request":
          setVisibleRefund(false);
          setRefundCustomerData({ refundCustomerData, refund_type: e.target.value, refunding_amount: 0.00, requestAmount: orderData.total_amount, refund_status: true })
          break;
        case "Partial Refund":
          setVisibleRefund(true);
          setRefundCustomerData({ refundCustomerData, refund_type: e.target.value, refunding_amount: 0.00, requestAmount: orderData.total_amount, refund_status: false })
        default:
          setRefundCustomerData({ refundCustomerData, refund_type: e.target.value, refunding_amount: 0.00, requestAmount: orderData.total_amount, refund_status: false })
          break;
      }
    }
    else {
      setRefundCustomerData({ ...refundCustomerData, [e.target.name]: e.target.value })
    }


  }


  const handleRejectPayment = () => {

  }

  return (
    <div className="prod_container">

      <>


        <div className='mainContainerTables mt-4 mb-4'>
          <div className="col-md-12 sub_box materialTableDP">



            <CCol md={12}>


              <h5 className="cardHeader">Refund for Customer</h5>
              <CRow>

                <CCol md={4}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select proper reason for payment rejection"
                    id="validationCustom04"
                    label="Refund Type"
                    onChange={handleFormData}
                    name="refund_type"
                    // value={formData.reasonRejection}
                    required
                  >
                    <option value={""} selected>Select Refund Type</option>
                    <option value="Full Refund">Full Refund</option>

                    <option value="Partial Refund">Partial Refund</option>
                    <option value="Reject Refund Request">Reject Refund Request</option>

                  </CFormSelect>
                </CCol>

                <CCol md={4}>
                  <CFormInput
                    type="number"
                    defaultValue={orderData.total_amount}
                    name="refundAmount"
                    id="validationCustom06"
                    label="Refund Request Amount"
                    disabled={true}
                    onChange={handleFormData}
                  // value={balanceAmount.balanceAmountToPay}
                  // onChange={handleBalancePayment}
                  />
                </CCol>

                <CCol md={4}>
                  <CFormInput
                    type="number"

                    value={refundCustomerData.refunding_amount}

                    name="refunding_amount"
                    id="validationCustom05"
                    label="Refunding Amount"
                    feedbackInvalid="Please fill refunding amount"
                    onChange={handleFormData}
                    // onChange={handleBalancePayment}
                    // required
                    disabled={!visibleRefund}
                  />
                </CCol>

              </CRow>




            </CCol>

          </div>
        </div>

        {/* {orderData.pay_category == "Online Transfer" ? */}
        <div className='mainContainerTables mt-4 mb-4'>
          <div className="col-md-12 sub_box materialTableDP">
            <CRow>
              <CCol md={6}>
                <h5 className="cardHeader">Customer Bank Details</h5>
                <CRow>
                  <CCol md={2}>
                    <CFormLabel>Bank Name</CFormLabel>
                  </CCol>
                  <CCol md={1}>
                    <CFormLabel>:</CFormLabel>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>{orderData.bank_name}</CFormLabel>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={2}>
                    <CFormLabel>Branch Name</CFormLabel>
                  </CCol>
                  <CCol md={1}>
                    <CFormLabel>:</CFormLabel>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>{orderData.branch_name}</CFormLabel>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={2}>
                    <CFormLabel>Account Name</CFormLabel>
                  </CCol>
                  <CCol md={1}>
                    <CFormLabel>:</CFormLabel>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>{orderData.account_name}</CFormLabel>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={2}>
                    <CFormLabel>Account Number</CFormLabel>
                  </CCol>
                  <CCol md={1}>
                    <CFormLabel>:</CFormLabel>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>{orderData.account_number}</CFormLabel>
                  </CCol>
                </CRow>

              </CCol>

              {/* <CCol md={6}>
                                <h5 className="cardHeader">Product Details</h5>
                                <CRow>
                                    <CCol md={2}>
                                        <CFormLabel>Product</CFormLabel>
                                    </CCol>
                                    <CCol md={1}>
                                        <CFormLabel>:</CFormLabel>
                                    </CCol>
                                    <CCol md={2}>
                                        <CFormLabel>{product?.product_name}</CFormLabel>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={2}>
                                        <CFormLabel>Product Description</CFormLabel>
                                    </CCol>
                                    <CCol md={1}>
                                        <CFormLabel>:</CFormLabel>
                                    </CCol>
                                    <CCol md={2}>
                                        <CFormLabel>{product?.product_desc}</CFormLabel>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={2}>
                                        <CFormLabel>Product Image</CFormLabel>
                                    </CCol>
                                    <CCol md={1}>
                                        <CFormLabel>:</CFormLabel>
                                    </CCol>
                                    <CCol md={2}>
                                        <CImage src={product?.product_image?.split(',')?.[0]} height={100} width={100} style={{ borderRadius: 15 }}></CImage>
                                    </CCol>
                                </CRow>



                            </CCol> */}
            </CRow>


          </div>
        </div>

        <div className="radioGroup">
          <CFormCheck button={{ color: 'success', variant: 'outline' }} type="radio" name="options-outlined" id="success-outlined" autoComplete="off" label="Confirm" defaultChecked onClick={handleApprovePayment} />

        </div>
      </>







    </div>
  );
}

export default CustomerFeedbacks;
