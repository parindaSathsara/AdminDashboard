/* eslint-disable */

import React, { useEffect, useState } from 'react'
import "./Sales.css"

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
import { CChartBar, CChartLine, CChartPie, CChartPolarArea } from '@coreui/react-chartjs'
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
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CButtonDropdown, CSelect } from '@coreui/react'
import axios from 'axios';


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

    const data = {
        columns: [
            { title: 'Product Name', field: 'productName' },
            { title: 'Product Price', field: 'productPrice' },
            { title: 'Profit', field: 'profit' },
        ],
        rows: [
            { productName: 'Product A', productPrice: 50, profit: 20 },
            { productName: 'Product B', productPrice: 30, profit: 15 },
            // Add more rows as needed
        ],
    };



    const [orderData, setOrderData] = useState([])
    // const [chartData, setChartData] = useState({
    //     categoryList: [],
    //     categoryCount: [],
    //     months: [],
    //     values: []
    // })
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

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptionLine, setSelectedOptionLine] = useState('');
    const [selectedOptionBar, setSelectedOptionBar] = useState('');
    const [chartData, setChartData] = useState(null);
    const [LineData, setLineData] = useState(null);
    const [BarData,setBarData] = useState(null)

    const handleSelectChange = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOption(event.target.value);
    };

    const handleSelect = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOptionLine(event.target.value);
    };

    const handleoptionBar =(event) =>{
        setSelectedOptionBar(event.target.value);
    }

    useEffect(() => {
        // Make the API request when the selected option changes
        if (selectedOption) {
            // Replace 'YOUR_API_BASE_URL' with the actual base URL of your API
            axios.get('/overall_sales/')
                .then(response => {
                    // Assuming the API response contains the necessary data for the chart
                    setChartData(response.data.data);
                    console.log("Response data:", response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // Handle error if needed
                });
        }
    }, [selectedOption]);

    useEffect(() => {
        // Make the API request when the selected option changes
        if (selectedOptionLine) {
            // Replace 'YOUR_API_BASE_URL' with the actual base URL of your API
            axios.get('/overall_amount')
                .then(res => {
                    // Assuming the API response contains the necessary data for the chart
                    setLineData(res.data);
                    console.log("Response data:", res.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // Handle error if needed
                });
        }
    }, [selectedOptionLine]);


    useEffect(()=>{
        if(selectedOptionBar){

            axios.get('http://172.16.26.170:8000/api/overall_totalprice')
            .then(reso => {
                setBarData(reso.data)
                console.log("reso",reso.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle error if needed
            });
        }
    }, [selectedOptionBar])


    var dateArray = LineData?.dates;
    var dateArrays = BarData?.dates;



    return (
        <>
            {/* <WidgetsDropdown /> */}


            <CRow>
                <CCol xs={12} md={6}>
                    <CCard className="mb-4 pieChart">
                        <CCardHeader>Pie Chart</CCardHeader>
                        <div className="mb-3 optionType ms-auto">
                            <label htmlFor="selectInput" className="form-label">Filter Date</label>
                            <select
                                id="selectInput"
                                className="form-select form-select-sm"
                                value={selectedOption}
                                onChange={handleSelectChange}
                            >
                                <option value="">Select an option</option>
                                <option value="last7Days">Last 7 Days</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="last3Months">Last 3 Months</option>
                                <option value="customSelect">Custom Select</option>
                            </select>
                        </div>
                        <CCardBody>
                            {/* Render the chart component using the chartData */}
                            <CChartPie className='smallPieChart'
                                data={{
                                    labels: ['Essentials', 'Non Essentials', 'Lifestyles', 'Hotel', 'Education', 'Flight'],
                                    datasets: [
                                        {
                                            data: [chartData?.essential, chartData?.nonessential, chartData?.lifestyle, chartData?.hotel, chartData?.education, chartData?.flight],
                                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#58508D', '#7AC142', ' #6CA0DC'],
                                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#58508D', '#7AC142', ' #6CA0DC'],
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>


                <CCol xs={12} md={6}>
                    <CCard className="mb-4 ">
                        <CCardHeader>Bar Chart</CCardHeader>
                        <div className='mb-3 optionType ms-auto'>
                            <label htmlFor='selectInput' className='form-label'>Filter Data</label>
                            <select
                                id="selectInput"
                                className='form-select form-select-sm'
                                value={selectedOptionBar}
                                onChange={handleoptionBar}
                            >
                                <option value="">Select an option</option>
                                <option value="last7Days">Last 7 Days</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="last3Months">Last 3 Months</option>
                                <option value="customSelect">Custom Select</option>
                            </select>
                        </div>
                        <CCardBody>
                            <CChartBar className='smallPieChart'
                                data={{
                                    labels:dateArrays,
                                    datasets: [
                                        {
                                            label: 'Overall total price',
                                            data: BarData?.amounts,
                                            backgroundColor: 'red',
                                        }
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
                            <div className="mb-3 optionType ms-auto">
                                <label htmlFor="selectInput" className="form-label">Filter Date</label>
                                <select
                                    id="selectInput"
                                    className="form-select form-select-sm"
                                    value={selectedOptionLine}
                                    onChange={handleSelect}
                                >
                                    <option value="">Select an option</option>
                                    <option value="last7Days">Last 7 Days</option>
                                    <option value="lastMonth">Last Month</option>
                                    <option value="last3Months">Last 3 Months</option>
                                    <option value="customSelect">Custom Select</option>
                                </select>
                            </div>
                            <CCardBody>
                                <CChartLine
                                    data={{
                                        labels: dateArray,
                                        datasets: [
                                            {
                                                label: 'Essentials',
                                                backgroundColor: 'red',
                                                borderColor: 'red',
                                                pointBackgroundColor: 'red',
                                                pointBorderColor: '#fff',
                                                data: LineData?.category_wise_data?.category_1,
                                            },
                                            {
                                                label: 'Non Essentials',
                                                backgroundColor: 'blue',
                                                borderColor: 'blue',
                                                pointBackgroundColor: 'blue',
                                                pointBorderColor: '#fff',
                                                data: LineData?.category_wise_data?.category_2,
                                            },

                                            {
                                                label: 'Lifestyles',
                                                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                                borderColor: 'rgba(151, 187, 205, 1)',
                                                pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                                pointBorderColor: '#fff',
                                                data: LineData?.category_wise_data?.category_3,
                                            },

                                            {
                                                label: 'Hotels',
                                                backgroundColor: 'green',
                                                borderColor: 'green',
                                                pointBackgroundColor: 'green',
                                                pointBorderColor: '#fff',
                                                data: LineData?.category_wise_data?.category_4,
                                            },
                                            {
                                                label: 'Education',
                                                backgroundColor: 'pink',
                                                borderColor: 'pink',
                                                pointBackgroundColor: 'pink',
                                                pointBorderColor: '#fff',
                                                data: LineData?.category_wise_data?.category_5,
                                            },
                                            {
                                                label: 'Flight',
                                                backgroundColor: 'orange',
                                                borderColor: 'orange',
                                                pointBackgroundColor: 'orange',
                                                pointBorderColor: '#fff',
                                                data: LineData?.category_wise_data?.category_6,
                                            }
                                        ],
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </div>




            </CRow>

            <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    title=""
                    data={data.rows}
                    columns={[
                        { title: 'Product Name', field: 'productName' },
                        { title: 'Product Price', field: 'productPrice' },
                        { title: 'Profit', field: 'profit' },
                    ]}
                    detailPanel={(e) => {
                        return (
                            <div className='mainContainerTables'>
                                <div className="col-md-12 mb-4 sub_box materialTableDP">
                                    <ProductDetails dataset={orderDataIDWise} orderid={e.oid} />
                                </div>
                            </div>
                        )
                    }}
                    options={{
                        sorting: true,
                        search: true,
                        // ... other options
                    }}
                // ... other props
                />
            </ThemeProvider>





        </>
    )
}

export default Sales
