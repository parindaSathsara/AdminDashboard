/* eslint-disable */

import React, { useEffect, useState } from 'react'
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

import WidgetsBrand from '../../widgets/WidgetsBrand'
import WidgetsDropdown from '../../widgets/WidgetsDropdown'
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



const Dashboard = () => {
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    const [orderid, setOrderId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);

    const [showMailModal, setShowMailModal] = useState(false);
    const [showAddtitionalModal, setShowAdditionalModal] = useState(false);
    const [rowDetails, setRowDetails] = useState([]);

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
            setOrderData(res)
        })

        getAllCardData().then(res => {
            console.log(res)
            setCardData(res)
        })
        // setOrderData(getAllDataUserWise());

    }, []);



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
                oid: value.OrderId,
                booking_date: value.checkout_date,
                pay_type: value.payment_type,
                pay_category: value.pay_category,
                total_amount: value.ItemCurrency + " " + value.total_amount,
                paid_amount: value.ItemCurrency + " " + value.paid_amount,
                discount_amount: value.ItemCurrency + " " + value.discount_price,
                delivery_charge: value.ItemCurrency + " " + value.delivery_charge,
                actions:
                    <div className='actions_box'>
                        {/* <NavLink to={"/api/view_order_voucher/" + value.OrderId} target='_blank'><i className='bi bi-printer-fill'></i></NavLink> */}
                        <button className="btn btn_actions btnViewAction" onClick={(e) => { handleModalOpen(value.OrderId, value) }}>View Order</button>
                    </div>
            }
        })
    }




    const [paymentDataSet, setPaymentDataSet] = useState([])

    const handleModalOpen = (value, dataSet) => {

        setOrderId(value)
        setPaymentDataSet(dataSet)
        setShowModal(true)


        console.log("Value", value)
    }


    const [tabIndex, setTabIndex] = useState("")


    const handleChange = (e) => {
        console.log(e)
    }


    return (
        <>
            {/* <WidgetsDropdown /> */}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="fullscreen"
                aria-labelledby="contained-modal-title-vcenter" >
                <Modal.Header closeButton>

                    <Modal.Title>Order Details {orderid}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modalBodyDef">
                    <OrderDetailsAccounts orderid={orderid} paymentDataSet={paymentDataSet}></OrderDetailsAccounts>
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
                                headerStyle: { background: '#3c4b64', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
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
