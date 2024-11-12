/* eslint-disable */

import React, { useEffect, useState } from 'react'

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
    CFormInput,
    CFormLabel,
    CFormTextarea,
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


import { getAllCardData, getAllDataUserWise, getAllRefundRequests, getDashboardOrdersIdWise, getVendorDetails } from 'src/service/api_calls'
import MaterialTable from 'material-table'
import { Icon, ThemeProvider, createTheme } from '@mui/material'

import { Modal, Tab, Tabs } from 'react-bootstrap'


import Swal from 'sweetalert2'


import LoadingBar from 'react-top-loading-bar'
import VendorDetails from './VendorDetails'
import axios from 'axios'
import LoaderPanel from 'src/Panels/LoaderPanel'
// import CustomerFeedbacks from './CustomerFeedbacks'

const VendorList = () => {
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

    const [refundRequests, setRefundRequests] = useState([])


    const [vendorDetails, setVendorDetails] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)
        getVendorDetails().then(res => {
            setVendorDetails(res)
            setLoading(false)
        })
        // setOrderData(getAllDataUserWise());

    }, []);



    const data = {
        columns: [
            // {
            //     title: '#ID', field: 'id', align: 'center', editable: 'never',
            // },

            {
                title: 'First Name', field: 'first_name', align: 'left', editable: 'never',
            },
            {
                title: 'Last Name', field: 'last_name', align: 'left', editable: 'never',
            },
            {
                title: 'Email', field: 'email', align: 'left', editable: 'never',
            },
            {
                title: 'Address', field: 'address', align: 'left', editable: 'never',
            },
            {
                title: 'Company Name', field: 'company_name', align: 'left', editable: 'never',
            },
            {
                title: 'Phone', field: 'phone', align: 'left', editable: 'never',
            },
            {
                title: 'Status', field: 'status', align: 'center', editable: 'never',
            },
            {
                title: 'Actions', field: 'actions', align: 'center', editable: 'never',
            },



        ],
        rows: vendorDetails?.map((value, idx) => {
            return {
                // id: value.MainTId,
                first_name: value.first_name,
                last_name: value.last_name,
                email: value.email,
                address: value.address,
                company_name: value.company_name,
                phone: value.phone,
                status: value.status == 2 ?
                    <CBadge color="danger" shape="rounded-pill" style={{ padding: 10, fontSize: 16 }}>Rejected</CBadge>
                    :
                    value.status == 1 ?
                        <CBadge color="success" shape="rounded-pill" style={{ padding: 10, fontSize: 16 }} >Approved</CBadge>
                        :
                        <CBadge color="info" shape="rounded-pill" style={{ padding: 10, fontSize: 16 }}>Not Approved</CBadge>,



                actions:
                    value.refund_type == "" || value.refund_type == null ?
                        <div className='actions_box'>
                            {/* <NavLink to={"/api/view_order_voucher/" + value.OrderId} target='_blank'><i className='bi bi-printer-fill'></i></NavLink> */}
                            <CButton onClick={(e) => { handleModalOpen(value.id, value) }} color="dark">Review Documents</CButton>
                        </div>
                        :
                        null


            }
        })
    }




    const [refundDataSet, setRefundDataSet] = useState([])

    const [vendorId, setVendorID] = useState("")
    const [vendorData, setVendorData] = useState([])

    const handleModalOpen = (value, dataSet) => {

        setVendorID(value)
        setVendorData(dataSet)
        setShowModal(true)


        // // console.log("Value", value)
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

    }


    const handleStatusChange = () => {

    }


    const [rejectPaymentModal, setRejectPaymentModal] = useState(false)

    const handleRejectDocuments = () => {
        setRejectPaymentModal(!rejectPaymentModal)
    }



    const handleAcceptVendor = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to accept this document",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#979797",
            cancelButtonColor: "#d33",
            confirmButtonText: "Accept Document"
        }).then((result) => {
            if (result.isConfirmed) {

                handleVendor();



            }
        });
    }

    const handleVendor = async () => {

        const data = {
            vendor_id: vendorId
        }

        await axios.post('/vendorApproval', data).then((res) => {
            // // console.log(res)

            if (res.data.status === 200) {
                Swal.fire({
                    title: "Document Accepted!",
                    text: "Vendor - " + vendorId + " Accepted",
                    icon: "success"
                });
                setShowModal(false)
                getVendorDetails().then(res => {
                    setVendorDetails(res)
                })
            }
            else {
                Swal.fire({
                    title: "Failed to Accept Document!",
                    text: "Vendor - " + vendorId + " Acception Failed",
                    icon: "danger"
                });
            }

        }).catch((err) => {
            Swal.fire({
                title: "Failed to Accept Document!",
                text: "Vendor - " + vendorId + " Acception Failed",
                icon: "danger"
            });
            throw new Error(err);
        })
    }


    const [validationIssue, setValidationIssues] = useState("")

    const handleReject = () => {

        if (!rejectionReason) {
            setValidationIssues("Please fill Reason for Rejection")
        }
        else {
            setValidationIssues("")
            Swal.fire({
                title: "Are you sure?",
                text: "You want to reject this document",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#979797",
                cancelButtonColor: "#d33",
                confirmButtonText: "Reject Document"
            }).then((result) => {
                if (result.isConfirmed) {

                    handleRejectDocuments();
                    rejectPayments();


                }
            });
        }

    }

    const rejectPayments = async () => {
        const data = {
            vendor_id: vendorId,
            vendor_rejection_remarks: rejectionReason
        }

        await axios.post('/rejectVendor', data).then((res) => {
            // // console.log(res)

            if (res.data.status === 200) {
                Swal.fire({
                    title: "Document Rejected!",
                    text: "Vendor - " + vendorId + " Rejected",
                    icon: "success"
                });
                getVendorDetails().then(res => {
                    setVendorDetails(res)
                })

            }
            else {
                Swal.fire({
                    title: "Document Rejection Failed!",
                    text: "Vendor - " + vendorId + " Rejection Failed",
                    icon: "danger"
                });
            }

        }).catch((err) => {
            Swal.fire({
                title: "Document Rejection Failed!",
                text: "Vendor - " + vendorId + " Rejection Failed",
                icon: "danger"
            });
            throw new Error(err);
        })
    }


    const [rejectionReason, setRejectionReason] = useState("")


    if (loading == true) {
        return (
            <LoaderPanel message={"Loading Vendors"} />
        )
    }
    else {
        return (
            <>
                {/* <WidgetsDropdown /> */}
                <LoadingBar color="#58c67d" progress={progress} onLoaderFinished={() => setProgress(0)} height={5} />


                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="fullscreen"
                    aria-labelledby="contained-modal-title-vcenter" >
                    <Modal.Header closeButton>

                        <Modal.Title style={{ marginRight: 15 }}>Vendor Details</Modal.Title>

                        {vendorData?.status == 1 ?
                            null :
                            <CButton color="success" onClick={handleAcceptVendor}>Accept Document</CButton>
                        }

                        {vendorData?.status == 2 ?
                            null
                            :
                            <CButton color="danger" style={{ marginLeft: 10 }} onClick={handleRejectDocuments}>Reject Document</CButton>
                        }


                    </Modal.Header>

                    <Modal.Body className="modalBodyDef">
                        <VendorDetails vendorId={vendorId} vendorData={vendorData} onStatusChange={handleStatusChange} rejectDocuments={handleRejectDocuments}></VendorDetails>
                    </Modal.Body>

                    <Modal.Footer className="mainFooterModal">

                    </Modal.Footer>
                </Modal>


                <Modal show={rejectPaymentModal} onHide={() => setRejectPaymentModal(false)} centered
                    aria-labelledby="contained-modal-title-vcenter" size='lg'>
                    <Modal.Header closeButton>

                        <Modal.Title style={{ marginRight: 15 }}>Reject Document</Modal.Title>

                    </Modal.Header>

                    <Modal.Body className="modalBodyDef">

                        <CCol md={12}>
                            <CFormLabel>Reason For Rejection</CFormLabel>
                            <CFormTextarea id="exampleFormControlTextarea1" onChange={(e) => setRejectionReason(e.target.value)} value={rejectionReason} rows={3}></CFormTextarea>

                            {validationIssue ?

                                <p style={{ color: 'red' }}>{validationIssue}</p>
                                :
                                null

                            }

                        </CCol>

                    </Modal.Body>

                    <Modal.Footer className="mainFooterModal">
                        <CButton color="danger" style={{ marginLeft: 10 }} onClick={handleReject}>Reject Document</CButton>
                    </Modal.Footer>
                </Modal>




                <CCard className="mb-4">
                    <CCardBody>
                        <CRow>
                            <CCol sm={5}>
                                <h4 id="traffic" className="card-title mb-0">
                                    Vendors
                                </h4>
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
                                    headerStyle: { background: '#070e1a', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
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

}

export default VendorList
