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
import { CChartBar, CChartLine,   CChartPie,CChartPolarArea } from '@coreui/react-chartjs'
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
        months: [],
        values: []
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
                <CCol xs={12} md={6}>
                    <CCard className="mb-4">
                        <CCardHeader>Pie Chart</CCardHeader>
                        <CCardBody>
                            <CChartPie
                                data={{
                                    labels: ['Red', 'Green', 'Yellow'],
                                    datasets: [
                                        {
                                            data: [300, 50, 100],
                                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol xs={12} md={6}>
                    <CCard className="mb-4">
                        <CCardHeader>Bar Chart</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
                                    datasets: [
                                        {
                                            label: 'GitHub Commits',
                                            backgroundColor: '#f87979',
                                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                                        },
                                    ],
                                }}
                                labels="months"
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
                <div>
                <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Line Chart</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random(), random(), random(), random(), random(), random()],
                  },
                  {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random(), random(), random(), random(), random(), random()],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
                </div>

            </CRow>







        </>
    )
}

export default Sales
