import React, { useEffect, useState, useMemo, useContext } from 'react'
import './AccountsDetails.css'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator'
import moment from 'moment'
import { PaymentStatusChange, getPaymentStatusById } from '../../service/api_calls'
import MaterialTable from 'material-table'
import { CButton, CCol, CSpinner } from '@coreui/react'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons'

function AccountsDetails(props) {
  const { userData } = useContext(UserLoginContext)
  const [toggle, setToggle] = useState(true)

  // useMemo(() => {
  //     props.dataset
  // }, [])

  // console.log(props.dataset, "Dataset data value is 1233333")

  const [dataset, setDataSet] = useState([])
  const [documentViewModal, setDocumentViewModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState([])

  useEffect(() => {
    console.log("Umayanga Diss Hii", props.dataset);
    if (props.pnlType == "orders") {
      getPaymentStatusById(
        props.dataset?.oid,
        props.dataset?.oid,
        props.dataset?.pay_type,
        props.dataset?.pay_category,
      ).then((res) => {
        setDataSet(res.data[0])
        console.log("resssss payment", res.data[0])

        const fileUrls = res.data[0]?.reference_Image
          ? res.data[0]?.reference_Image.split(',').map((url) => url.trim())
          : []
        console.log(fileUrls, 'Extracted File URLs')
        setSelectedDocument(fileUrls)
      })
    } else {
      console.log("Umayanga Diss Hii", props.dataset);
      setDataSet(props.dataset)
    }

  }, [props.dataset])

  const handleImageView = () => {
    setDocumentViewModal(!documentViewModal)
  }

  function generateRandom() {
    var length = 8,
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      retVal = ''
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    return retVal
  }

  const handlePaymentProof = async (e) => {
    await props.paymentproof(e)
  }

  const handlePaymentStatusChange = (e, val) => {
    // console.log(val.target.value)

    var user = sessionStorage.getItem('user')
    var username = JSON.parse(user)
    var active_user = username.name

    if (window.confirm('Are you sure to change payment status?')) {
      PaymentStatusChange(e.oid, val.target.value, active_user)
    }

    // updateDeliveryStatus(e.row.id, val.target.value, e.row.category)

    // props.relord();
  }

  // const data = {
  //     columns: [
  //         // {
  //         //     title: '#ID', field: 'id', align: 'center', editable: 'never',
  //         // },
  //         {
  //             field: 'pay_status', title: 'Payment Status', editable: true, align: 'left', render: (e) => {

  //                 return (
  //                     <>
  //                         <select className='form-select required' name='delivery_status' onChange={(value) => handlePaymentStatusChange(e, value)}>
  //                             {e.del_status == "Pending" ?
  //                                 <option value="Pending" selected>Pending</option>
  //                                 :
  //                                 <option value="Pending">Pending</option>
  //                             }
  //                             {e.del_status == "Confirmed" ?
  //                                 <option value="Confirmed" selected>Confirmed</option>
  //                                 :
  //                                 <option value="Confirmed">Confirmed</option>
  //                             }
  //                         </select>
  //                     </>
  //                 )
  //             }
  //         },
  //         { field: 'pay_mode', title: 'PaymentMode', align: 'left', },
  //         { field: 'pay_type', title: 'PaymentType', align: 'left', },
  //         { field: 'receivable_amount', title: 'ReceivableAmount', align: 'left', },
  //         { field: 'paid_amount', title: 'PaidAmount', align: 'left', },
  //         { field: 'balance_amount', title: 'BalanceAmount', align: 'left', },
  //         { field: 'receivable_dead', title: 'ReceivableDeadline', align: 'left', },
  //         { field: 'payment_proof', title: 'PaymentProof', align: 'left', render: (e) => (<><button type='button' className='btn btn_payment_proof_view' onClick={() => handlePaymentProof(e)}>View Details</button></>) },

  //     ],
  //     rows: props.dataset?.map((value) => {
  //         return {
  //             id: value.MainTId,
  //             oid: value.OrderId,
  //             pay_status: value.MainPayStatus,
  //             pay_mode: value.payment_type,
  //             pay_type: value.pay_category,
  //             receivable_amount: value.ItemCurrency + parseFloat(value.TotalAmount).toFixed(2),
  //             paid_amount: value.ItemCurrency + parseFloat(value.PaidAmount).toFixed(2),
  //             balance_amount: value.ItemCurrency + parseFloat(value.BalanceAmount).toFixed(2),
  //             receivable_dead: 'N/A',
  //             payment_proof: '-',

  //         }
  //     })

  // }

  const [pnlReportLoading, setpnlReportLoading] = useState(false)
  const [PNLVoucherView, setPNLVoucherView] = useState(false)
  const [currenctOrdeId, setCurrenctOrderId] = useState('')
  const [productPNLReport, setProductPNLReport] = useState([])

  const handlePNLReport = async (data) => {
    console.log("Umayanga Vidu", data);

    let id;
    let url = '';
    if (props?.pnlType == "orders") {
      url = "/pnl/order";
      id = data?.checkout_id;
    } else {
      url = "/pnl/order-product";
      id = "";
    }
    setpnlReportLoading(true)
    await axios
      .get(`${url}/${id}`)
      .then((response) => {
        setPNLVoucherView(true)
        setCurrenctOrderId(id)
        setProductPNLReport(response.data)
        setpnlReportLoading(false)

        // console.log(response.data, 'Handle PNL Report')
      })
      .catch((error) => {
        console.log(error, 'Handle PNL Report')
      })
  }

  const [loading, setLoading] = useState(false)

  const downloadPdf = async () => {
    let url = '';

    if (props?.pnlType == "orders") {
      url = `${axios.defaults.baseURL}/pnl/order/${currenctOrdeId}/pdf`;
    } else {
      url = `${axios.defaults.baseURL}/pnl/order-product/${currenctOrdeId}/pdf`;
    }
    console.log('Opening URL:', url)
    window.open(url, '_blank')

    // try {
    //     setLoading(true)
    //     const response = await axios.get(`/pnl/order/${currenctOrdeId}/pdf`, {
    //         responseType: 'blob',
    //     });

    //     setLoading(false)
    //     const blob = new Blob([response.data], { type: 'application/pdf' });
    //     const link = document.createElement('a');
    //     link.href = window.URL.createObjectURL(blob);
    //     link.download = `PNL_report-OrderId-${currenctOrdeId}.pdf`;
    //     link.click();
    // } catch (error) {
    //     console.error('Error downloading the PDF:', error);
    // }
  }

  const handleCLosePNRLReportModal = () => {
    setPNLVoucherView(false)
    setCurrenctOrderId('')
    setProductPNLReport([])
  }

  return (
    <>
      <div className="confirmation_container">
        {/* <div className='expand_bar'>
                    <button type='button' className='btn confirm_details_title mx-2 btn_expand btn-sm' id='btn_expand' onClick={() => setToggle(!toggle)} >Accounts Details {toggle == true ? <i class="bi bi-dash-lg"></i> : <i className="bi bi-plus-lg"></i>}</button>
                </div> */}

        {toggle && (
          <div className="confirmation_table mt-3" id="confirmation_table">
            {/* <DataGrid
                                rows={rows.data}
                                columns={columns}
                                encodeHtml={false}
                                getRowClassName={(e) => `type_class${e.row.product_type}`}
                                getRowId={(row) => generateRandom()}
                                pageSizeOptions={[5]}
                                rowHeight={30}
                                className='data_grid'
                            // onCellClick={(e) => handleClick(e)}

                            /> */}

            <CCol xs={12} sm={12} lg={12}>
              <div className="mainContainerTables">
                <div className="col-md-12 mb-4 sub_box materialTableDP">
                  <h6 className="cardHeader">Payment Type - {dataset?.['pay_category']}</h6>
                  {dataset?.['pay_category'] == 'Online Transfer' ? (
                    <>
                      <table class="table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">Reference No</th>
                            <th scope="col">Reference E-mail</th>
                            <th scope="col">Reference Image</th>
                            <th scope="col">Checkout Date</th>
                            <th scope="col">PNL report</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>
                              <b>{dataset['reference_no']}</b>
                            </td>
                            <td>{dataset['reference_email']}</td>
                            <td>
                              {selectedDocument.length === 1 ? (
                                <a
                                  target="_blank"
                                  href={`${axios.defaults.imageUrl}/${dataset['reference_Image']}`}
                                >
                                  <img
                                    src={`${axios.defaults.imageUrl}/${dataset['reference_Image']}`}
                                    width="150"
                                    height="150"
                                    style={{ objectFit: 'cover' }}
                                  />
                                </a>
                              ) : (
                                <CButton
                                  color="info"
                                  style={{ fontSize: 12, color: 'white' }}
                                  onClick={() => {
                                    handleImageView()
                                  }}
                                >
                                  View
                                </CButton>
                              )}
                            </td>
                            <td>{dataset['checkout_date']}</td>
                            <td>
                              {[
                                'all accounts access',
                                'view customer order pnl',
                                'view account pnl',
                              ].some((permission) =>
                                userData?.permissions?.includes(permission),
                              ) && (
                                  <CButton
                                    color="info"
                                    style={{
                                      fontSize: 16,
                                      color: 'white',
                                      marginLeft: 20,
                                      alignContent: 'center',
                                    }}
                                    onClick={() => handlePNLReport(dataset)}
                                  // onClick={() => console.log(dataset)}
                                  >
                                    Show PNL report
                                  </CButton>
                                )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  ) : dataset?.['pay_category'] == 'Card Payment' ? (
                    <>
                      <table className="table table-bordered table__PayentProf">
                        <thead>
                          <tr>
                            <th scope="col">Transaction No</th>
                            <th scope="col">Reference No</th>
                            <th scope="col">Gateway</th>

                            <th scope="col">Checkout Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {dataset['result'] == 'SUCCESS' ? (
                              <td className="status_success">{dataset['result']}</td>
                            ) : (
                              <td>{dataset['payment_transaction_id'].split('|')[1]}</td>
                            )}
                            <td>{dataset['payment_transaction_id'].split('|')[0]}</td>
                            <td>{dataset['gateway_type']}</td>
                            <td>{dataset['created_at']}</td>
                            <td>
                              {[
                                'all accounts access',
                                'view customer order pnl',
                                'view account pnl',
                              ].some((permission) =>
                                userData?.permissions?.includes(permission),
                              ) && (
                                  <CButton
                                    color="info"
                                    style={{
                                      fontSize: 16,
                                      color: 'white',
                                      marginLeft: 20,
                                      alignContent: 'center',
                                    }}
                                    onClick={() => handlePNLReport(dataset)}
                                  // onClick={() => console.log(dataset)}
                                  >
                                    Show PNL report
                                  </CButton>
                                )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      {['all accounts access', 'view customer order pnl', 'view account pnl'].some(
                        (permission) => userData?.permissions?.includes(permission),
                      ) && (
                          <CButton
                            color="info"
                            style={{
                              fontSize: 16,
                              color: 'white',
                              marginLeft: 20,
                              alignContent: 'center',
                            }}
                            onClick={() => handlePNLReport(dataset)}
                          // onClick={() => console.log(dataset)}
                          >
                            Show PNL report
                          </CButton>
                        )}
                      {console.log(dataset, 'Data set key iss dataa')}
                    </>
                  )}
                </div>
              </div>
            </CCol>
          </div>
        )}
      </div>

      <Modal
        show={PNLVoucherView}
        size="xl"
        onHide={handleCLosePNRLReportModal}
        style={{ zIndex: 999999999 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>PNL Report</Modal.Title>
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
              <p>The product has been yet to be approved !</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: productPNLReport }} />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={documentViewModal}
        style={{ marginTop: '20%', zIndex: 999999999 }}
        onHide={() => setDocumentViewModal(false)}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Document View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && selectedDocument.length > 0 ? (
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {selectedDocument.map((url, index) => {
                const fileName = url.split('/').pop() // Extract the file name from the URL
                return (
                  <li
                    key={index}
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between', // Align file name and icon
                      borderBottom: '1px solid #ddd', // Add a divider between items
                      paddingBottom: '5px',
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{fileName}</span>
                    <a
                      href={axios.defaults.imageUrl + url}
                      download={fileName} // This attribute will prompt a download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CIcon icon={cilInfo} size="lg" />
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>No documents available to display.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AccountsDetails
