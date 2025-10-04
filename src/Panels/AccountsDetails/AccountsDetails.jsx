import React, { useEffect, useState, useContext } from 'react'
import './AccountsDetails.css'
import { CButton, CCol, CSpinner } from '@coreui/react'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

function AccountsDetails(props) {
  const { userData } = useContext(UserLoginContext)
  const [toggle, setToggle] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const [documentViewModal, setDocumentViewModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState([])
  const [loading, setLoading] = useState(false)

  // ✅ Check if it's orders type
  const isOrdersType = props.pnlType === "orders"

  // Fetch payment details using your API
  const fetchPaymentDetails = async () => {
    if (!isOrdersType || !props.dataset) return;

    try {
      setLoading(true)
      const response = await axios.post('/fetch_order_wise_payment_details', {
        rowid: props.dataset?.rowid || props.dataset?.id,
        orderid: props.dataset?.oid || props.dataset?.OrderId,
        paymentmood: props.dataset?.pay_type,
        paymenttype: props.dataset?.pay_category
      })

      if (response.data.status === 200) {
        setPaymentData(response.data)
        console.log("API Response:", response.data)
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOrdersType) {
      fetchPaymentDetails()
    }
  }, [props.dataset, props.pnlType])

  const handleImageView = () => {
    setDocumentViewModal(!documentViewModal)
  }

  const getReferenceImage = () => {
    // Check API top-level reference_Image
    if (paymentData?.response?.[0]?.reference_Image) {
      return paymentData.response[0].reference_Image;
    }

    // Existing checks (optional, if needed)
    if (paymentData?.essNEssData?.[0]?.product_image) {
      return paymentData.essNEssData[0].product_image;
    }
    if (paymentData?.productData?.[0]?.product_image) {
      return paymentData.productData[0].product_image;
    }
    if (paymentData?.lifestyleData?.[0]?.product_image) {
      return paymentData.lifestyleData[0].product_image;
    }

    return null;
  };

  const getTotalAmount = () => {
    if (paymentData?.response?.[0]?.total_amount) {
      return parseFloat(paymentData.response[0].total_amount).toFixed(2);
    }
    return "0.00";
  };

  // Get paid amount
  const getPaidAmount = () => {
    if (paymentData?.response?.[0]?.paid_amount) {
      return parseFloat(paymentData.response[0].paid_amount).toFixed(2);
    }
    return "0.00";
  };

  const getBalanceAmount = () => {
    if (paymentData?.response?.[0]?.balance_amount) {
      return parseFloat(paymentData.response[0].balance_amount).toFixed(2);
    }
    return "0.00";
  };

  // Get payment type from props
  const getPaymentType = () => {
    return props.dataset?.pay_category || 'N/A'
  }

  // Get currency
  const getCurrency = () => {
    if (paymentData?.essNEssData?.[0]?.currency) {
      return paymentData.essNEssData[0].currency
    }
    if (paymentData?.productData?.[0]?.currency) {
      return paymentData.productData[0].currency
    }
    return 'USD' // default
  }

  const [pnlReportLoading, setpnlReportLoading] = useState(false)
  const [PNLVoucherView, setPNLVoucherView] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState('')
  const [productPNLReport, setProductPNLReport] = useState([])

  const handlePNLReport = async () => {
    let id
    let url = ''

    if (isOrdersType) {
      url = "/pnl/order"
      id = props?.orderid
    } else {
      url = "/pnl/order-product"
      id = props?.productData?.[0]?.checkoutID
    }

    setpnlReportLoading(true)
    try {
      const response = await axios.get(`${url}/${id}`)
      setPNLVoucherView(true)
      setCurrentOrderId(id)
      setProductPNLReport(response.data)
    } catch (error) {
      console.error('Error fetching PNL report:', error)
    } finally {
      setpnlReportLoading(false)
    }
  }

  const downloadPdf = async () => {
    let url = ''
    if (isOrdersType) {
      url = `${axios.defaults.baseURL}/pnl/order/${currentOrderId}/pdf`
    } else {
      url = `${axios.defaults.baseURL}/pnl/order-product/${currentOrderId}/pdf`
    }
    console.log('Opening URL:', url)
    window.open(url, '_blank')
  }

  const handleClosePNLReportModal = () => {
    setPNLVoucherView(false)
    setCurrentOrderId('')
    setProductPNLReport([])
  }

  // ✅ Check if user has PNL permissions
  const hasPNLPermissions = [
    'all accounts access',
    'view customer order pnl',
    'view account pnl',
  ].some(permission => userData?.permissions?.includes(permission))

  return (
    <>
      <div className="confirmation_container">
        {toggle && (
          <div className="confirmation_table mt-3" id="confirmation_table">
            <CCol xs={12} sm={12} lg={12}>
              <div className="mainContainerTables">
                <div className="col-md-12 mb-4 sub_box materialTableDP">
                  {loading ? (
                    <div className="text-center p-3">
                      <CSpinner />
                      <div>Loading payment details...</div>
                    </div>
                  ) : (
                    <>
                      {/* ✅ CONDITIONAL RENDERING BASED ON TYPE */}
                      {isOrdersType ? (
                        // ✅ ORDERS TYPE - Show all details
                        <div className="row align-items-center bg-light p-3 rounded">
                          {/* Total Amount */}
                          <div className="col-md-2 text-center">
                            <h6 className="text-muted mb-1">Total Amount</h6>
                            <h4 className="text-success mb-0">
                              {getCurrency()} {getTotalAmount()}
                            </h4>
                          </div>

                          {/* Paid Amount */}
                          <div className="col-md-2 text-center">
                            <h6 className="text-muted mb-1">Paid Amount</h6>
                            <h4 className="text-info mb-0">
                              {getCurrency()} {getPaidAmount()}
                            </h4>
                          </div>

                          {/* Balance Amount */}
                          <div className="col-md-2 text-center">
                            <h6 className="text-muted mb-1">Balance Amount</h6>
                            <h4 className="text-danger mb-0">
                              {getCurrency()} {getBalanceAmount()}
                            </h4>
                          </div>

                          {/* Payment Type */}
                          <div className="col-md-2 text-center">
                            <div>
                              <h6 className="text-muted mb-1">Payment Type</h6>
                              <h5 className="text-primary mb-0">{getPaymentType()}</h5>
                            </div>
                          </div>

                          {/* Reference Image */}
                          <div className="col-md-2 text-center">
                            <div>
                              <h6 className="text-muted mb-2">Reference Image</h6>
                              {getReferenceImage() ? (
                                <a
                                  target="_blank"
                                  href={getReferenceImage()}
                                  rel="noopener noreferrer"
                                  className="d-inline-block"
                                >
                                  <img
                                    src={paymentData?.response?.[0]?.paySlips?.[0] || getReferenceImage()}
                                    width="80"
                                    height="60"
                                    style={{ objectFit: 'cover', borderRadius: '6px', border: '2px solid #dee2e6', cursor: 'pointer' }}
                                    alt="Reference"
                                  />
                                </a>
                              ) : (
                                <div className="text-muted">
                                  <small>No image</small>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Show PNL Report */}
                          <div className="col-md-2 text-center">
                            <div>
                              <h6 className="text-muted mb-2">PNL Report</h6>
                              {hasPNLPermissions && (
                                <CButton
                                  color="info"
                                  size="sm"
                                  style={{
                                    color: 'white',
                                    minWidth: '120px'
                                  }}
                                  onClick={handlePNLReport}
                                  disabled={pnlReportLoading}
                                >
                                  {pnlReportLoading ? <CSpinner size="sm" /> : 'Show PNL'}
                                </CButton>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // ✅ NON-ORDERS TYPE - Show only PNL Report
                        <div className="row align-items-center bg-light p-3 rounded">
                          <div className="col-md-12 text-center">
                            <div>
                              <h6 className="text-muted mb-2">PNL Report</h6>
                              {hasPNLPermissions && (
                                <CButton
                                  color="info"
                                  size="lg"
                                  style={{
                                    color: 'white',
                                    minWidth: '200px',
                                    fontSize: '16px'
                                  }}
                                  onClick={handlePNLReport}
                                  disabled={pnlReportLoading}
                                >
                                  {pnlReportLoading ? <CSpinner size="sm" /> : 'Show PNL Report'}
                                </CButton>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CCol>
          </div>
        )}
      </div>

      {/* PNL Report Modal */}
      <Modal
        show={PNLVoucherView}
        size="xl"
        onHide={handleClosePNLReportModal}
        style={{ zIndex: 999999999 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>PNL Report - Order {currentOrderId}</Modal.Title>
          <div>
            {productPNLReport.status !== 'fail' &&
              productPNLReport.message !== 'No data to display' && (
                <CButton
                  color="info"
                  style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }}
                  onClick={downloadPdf}
                >
                  Download Voucher
                  {loading ? <CSpinner variant="grow" size="sm" /> : null}
                </CButton>
              )}
          </div>
        </Modal.Header>
        <Modal.Body>
          {productPNLReport.status === 'fail' &&
            productPNLReport.message === 'No data to display' ? (
            <div className="d-flex flex-column align-items-center my-5">
              <h6>Oops! Sorry</h6>
              <p>The product has been yet to be approved!</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: productPNLReport }} />
          )}
        </Modal.Body>
      </Modal>

      {/* Document View Modal */}
      <Modal
        show={documentViewModal}
        style={{ marginTop: '20%', zIndex: 999999999 }}
        onHide={() => setDocumentViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Slips</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && selectedDocument.length > 0 ? (
            <div className="document-container" style={{
              maxWidth: "800px",
              margin: "0 auto",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#fff"
            }}>
              <ul style={{
                padding: 0,
                margin: 0,
                listStyleType: 'none'
              }}>
                {selectedDocument.map((url, index) => {
                  const fileName = `Slip ${index + 1}`;
                  return (
                    <li key={index} style={{
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: index !== selectedDocument.length - 1 ? '1px solid #eee' : 'none',
                      transition: 'background-color 0.2s',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        fontWeight: '500',
                        marginRight: '16px',
                        minWidth: '100px'
                      }}>
                        {fileName}
                      </div>

                      <div style={{
                        position: 'relative',
                        marginRight: '20px'
                      }}>
                        <img
                          src={url}
                          alt={fileName}
                          style={{
                            width: '100px',
                            height: '75px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #e9ecef',
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                      </div>

                      <div style={{ flexGrow: 1 }}></div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 12px',
                            backgroundColor: '#e9ecef',
                            color: '#495057',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
                        >
                          <CIcon icon={cilInfo} style={{ marginRight: '6px' }} /> View
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>No documents available</div>
              <p style={{ margin: 0 }}>Upload documents to see them displayed here.</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AccountsDetails