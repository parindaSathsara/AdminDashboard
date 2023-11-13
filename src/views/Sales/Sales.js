/* eslint-disable */

import React, { useEffect, useState } from 'react'

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
import { CChartBar, CChartLine, CChartPolarArea } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
    cibGmail,
    cibFilezilla,
    cilNoteAdd,
    cilViewModule,
    cilViewColumn,
    cilViewStream
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { DocsExample } from 'src/components'
import { getAllCardData, getAllChartsDataSales, getAllDataUserWise, getDashboardOrdersIdWise } from 'src/service/api_calls'
import MaterialTable from 'material-table'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import ProductDetails from 'src/Panels/ProductDetails/ProductDetails'
import ConfirmationDetails from 'src/Panels/ConfirmationDetails/ConfirmationDetails'
import AccountsDetails from 'src/Panels/AccountsDetails/AccountsDetails'
import SupDetails from 'src/Panels/SupDetails/SupDetails'
import FeebackDetails from 'src/Panels/FeebackDetails/FeebackDetails'
import { Tab, Tabs } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import PaymentModal from 'src/Panels/PaymentModal/PaymentModal'
import AdditionalData from 'src/Panels/AdditionalData/AdditionalData'
import MailBox from 'src/Panels/MailBox/MailBox'
import AdditionalInfoBox from 'src/Panels/AdditionalInfoBox/AdditionalInfoBox'



const Sales = () => {
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

    const handleAdditionalModal = (e) => {
        setShowModalAdd(true)
        console.log(e)
        setOrderId(e)
    }


    const handleAdditionalInfoModal = (e) => {
        setShowAdditionalModal(true)
        setOrderId(e)
    }


    const defaultMaterialTheme = createTheme();



    const [orderData, setOrderData] = useState([])
    const [chartData, setChartData] = useState({
        categoryList: [],
        categoryCount: [],
        months:[],
        values:[]
    })
    const [orderDataIDWise, setOrderDataIdWise] = useState([])

    useEffect(() => {


        getAllChartsDataSales().then(res => {
            console.log("Response data is", res)
            setChartData(res)
        })
        // setOrderData(getAllDataUserWise());

    }, []);



    const [tabIndex, setTabIndex] = useState("")


    const handleChange = (e) => {
        console.log(e)
    }


    return (
        <>
            {/* <WidgetsDropdown /> */}


            <CRow>
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>Category Sales Pie Chart (Last 30 Days)</CCardHeader>
                        <CCardBody>
                            <CChartPolarArea
                                data={{
                                    labels: chartData.categoryList,
                                    datasets: [
                                        {
                                            data: chartData.categoryCount,
                                            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB', '#36A2EB'],
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>Sales Bar Chart (This Year)</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                data={{
                                    labels: chartData.months,
                                    datasets: [
                                        {
                                            label: 'Sales',
                                            backgroundColor: '#f87979',
                                            data: chartData.values,
                                        },
                                    ],
                                }}
                                labels="months"
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

            </CRow>







        </>
    )
}

export default Sales
