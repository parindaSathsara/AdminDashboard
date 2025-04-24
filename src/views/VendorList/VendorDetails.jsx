import MaterialTable from 'material-table'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import { useEffect, useState } from 'react';
import { getAllFeedbacks, getAllRefundRequests } from 'src/service/api_calls';
import { GoStarFill } from "react-icons/go";
import axios from 'axios';
import { CCol, CFormCheck, CFormInput, CFormLabel, CFormSelect, CImage, CRow } from '@coreui/react';
import Swal from 'sweetalert2';

import { Modal, Tab, Tabs } from 'react-bootstrap'


function VendorDetails(props) {
    console.log("Vendor Details Props", props);
    
    const [vendorDetails, setVendorDetails] = useState([])

    useEffect(() => {
        setVendorDetails(props.vendorData)
    }, [props.vendorData])

    console.log("Vendor Details", vendorDetails);
    
    const [showModal, setShowModal] = useState(false)


    return (
        <div className="prod_container">

            <>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered
                    aria-labelledby="contained-modal-title-vcenter" >
                    <Modal.Header closeButton>

                        <Modal.Title style={{ marginRight: 15 }}>Vendor Details</Modal.Title>


                        {/* <CButton color="success">Accept Document</CButton>
                        <CButton color="danger" style={{ marginLeft: 10 }}>Reject Document</CButton> */}
                    </Modal.Header>

                    <Modal.Body className="modalBodyDef">
                        <CRow className='mb-3'>
                            <CCol md={5}>

                            </CCol>
                        </CRow>
                    </Modal.Body>

                    <Modal.Footer className="mainFooterModal">

                    </Modal.Footer>
                </Modal>

                <CRow className='mb-3'>
                    <CCol md={5}>
                        <CRow className='mb-3'>
                            <CCol md={6}>
                                <CFormLabel>First Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.first_name}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                            <CCol md={6} >
                                <CFormLabel>Last Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.last_name}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                        </CRow>

                        <CRow className='mb-3'>
                            <CCol md={6}>
                                <CFormLabel>Email</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.email}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel>Address</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.address}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                        </CRow>

                        <CRow className='mb-3'>
                            <CCol md={6}>
                                <CFormLabel>Nature of Business</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.nature_of_business}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel>Business Description</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.business_description}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                        </CRow>



                        <CRow className='mb-3'>
                            <CCol md={6}>
                                <CFormLabel>Business Type</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.business_type}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel>Company Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.company_name}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>
                        </CRow>

                        <CRow className='mb-3'>
                            <CCol md={6}>
                                <CFormLabel>NIC Number</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.nic_numer}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel>BR Number</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.br_number}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>
                        </CRow>

                        <CRow className='mb-3'>
                            <CCol md={6}>
                                <CFormLabel>Phone</CFormLabel>
                                <CFormInput
                                    type="text"
                                    size="sm"
                                    value={vendorDetails.Phone}

                                    aria-label="lg input example"
                                    disabled={true}
                                />
                            </CCol>

                        </CRow>



                    </CCol>
                    <CCol md={1}>
                    </CCol>
                    <CCol md={6}>

                        <CRow>


                            <CCol md={6} className='mb-5'>
                                <CFormLabel>BR Copy</CFormLabel><br></br>
                                {vendorDetails.br_copy == "" || vendorDetails.br_copy == null ?
                                    <h6 style={{ color: 'red' }}>Not Uploaded</h6>

                                    :
                                    // <a href={"https://staging-supplier.aahaas.com/" + vendorDetails.br_copy} target='_blank'>Get BR Copy</a>
                                    <a href={axios.defaults.supplierUrl + vendorDetails.br_copy} target='_blank'>Get BR Copy</a>

                                }
                            </CCol>

                            <CCol md={6}>


                                <CFormLabel>NIC Copy</CFormLabel><br></br>

                                {vendorDetails.nic_image == "" || vendorDetails.nic_image == null ?
                                    <h6 style={{ color: 'red' }}>Not Uploaded</h6>
                                    :
                                    <a href={"https://supplier.aahaas.com/" + vendorDetails.nic_image} target='_blank'>Get NIC Copy</a>
                                }

                            </CCol>

                        </CRow>

                    </CCol>

                </CRow>

                {/* <div className='mainContainerTables mt-4 mb-4'>
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
                       
                             
                                    />
                                </CCol>

                            </CRow>




                        </CCol>

                    </div>
                </div> */}

                {/* {orderData.pay_category == "Online Transfer" ?
                    <div className='mainContainerTables mt-4 mb-4'>
                        <div className="col-md-12 sub_box materialTableDP">
                            <CRow>
                                <CCol md={5}>
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

                                <CCol md={5}>
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



                                </CCol>
                            </CRow>


                        </div>
                    </div>
                    :
                    null

                } */}



            </>

            {/* {feedbacks.length > 0 ?
                <MaterialTable
                    title="Customer Feedbacks"
        
                    data={data.rows}
                    columns={data.columns}


                    options={{

                        sorting: true, search: true,
                        searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                        filtering: false, paging: true, pageSizeOptions: [5, 10, 15, 20], pageSize: 5,
                        paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                        exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                        showSelectAllCheckbox: false, showTextRowsSelected: false,
                        grouping: true, columnsButton: true,
                        headerStyle: { background: '#070e1a', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                        rowStyle: { fontSize: "15px", width: "100%", color: "#000" },

                    }}
                />
                :
                null

            } */}







        </div>
    );
}

export default VendorDetails;