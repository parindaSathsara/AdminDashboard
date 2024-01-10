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
import { PacmanLoader } from 'react-spinners';


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
    const [chartData, setChartData] = useState({});
    const [LineData, setLineData] = useState(null);
    const [BarData, setBarData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorBar, setErrorBar] = useState(null);



    const [pieloading, setPieLoading] = useState(false);
    const [pieerror, setPieError] = useState(null);


    const [lineloading, setLineLoading] = useState(false);
    const [lineerror, setLineError] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [startDateBar, setStartDateBar] = useState('');
    const [endDateBar, setEndDateBar] = useState('');

    const [startDateLine, setStartDateLine] = useState('');
    const [endDateLine, setEndDateLine] = useState('');





    const handleSelectChange = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOption(event.target.value);
    };

    const handleSelectLine = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOptionLine(event.target.value);
    };

    const handleoptionBar = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOptionBar(event.target.value);
    }

    useEffect(() => {

        if (selectedOption && selectedOption !== 'customSelect') {
            // Your existing logic for other options
            setPieLoading(true);
            setPieError(null);

            // Modify the endpoint based on the selected date option
            const apiUrl = `overall_sales/${selectedOption}`;

            axios.get(apiUrl)
                .then((response) => {
                    setChartData(response.data.data);
                    console.log("Response data:", response.data.data);
                })
                .catch((error) => {
                    console.error('No data for this date. Please try again.', error);
                    setPieError('No data for this date. Please try again.');
                })
                .finally(() => {
                    setPieLoading(false);
                });

        } else if (selectedOption === 'customSelect' && startDate && endDate) {
            setPieLoading(true);
            setPieError(null);

            // Modify the endpoint based on the selected date option
            const apiUrl = `overall_sales/${startDate}/${endDate}`;


            axios.get(apiUrl)
                .then((response) => {
                    setChartData(response.data.data);
                    console.log("Response data:", response.data.data);
                })
                .catch((error) => {
                    console.error('Error fetching data for the selected date range.', error);
                    setPieError('Error fetching data for the selected date range. Please try again.');
                })
                .finally(() => {
                    setPieLoading(false);
                });
        }
    }, [selectedOption, startDate, endDate]);



    useEffect(() => {
        if (selectedOptionBar && selectedOptionBar !== 'customSelect') {
            setLoading(true);
            setErrorBar(null);



            const apiUrl = `overall_totalprice/${selectedOptionBar}`;

            axios.get(apiUrl)
                .then((response) => {
                    setBarData(response.data);
                    console.log("Bar Chart Response data:", response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data for the selected date range:', error);
                    setErrorBar('Error fetching data for the selected date range. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        else if (selectedOptionBar === 'customSelect' && startDateBar && endDateBar) {
            setLoading(true);
            setErrorBar(null);



            const apiUrl = `overall_totalprice/${startDateBar}/${endDateBar}`;

            axios.get(apiUrl)
                .then((response) => {
                    setBarData(response.data);
                    console.log("Bar Chart Response data:", response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data for the selected date range:', error);
                    setErrorBar('Error fetching data for the selected date range. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [selectedOptionBar, startDateBar, endDateBar]);


    useEffect(() => {
        if (selectedOptionLine && selectedOptionLine !== 'customSelect') {
            // Your existing logic for other options
            setLineLoading(true);
            setLineError(null);

            // Modify the endpoint based on the selected date option
            const apiUrl = `overall_amount/${selectedOptionLine}`;

            axios.get(apiUrl)
                .then((res) => {
                    setLineData(res.data);
                    console.log("Line Chart Response data:", res.data);
                })
                .catch((error) => {
                    console.error('Error fetching data for the selected date range:', error);
                    setLineError('Error fetching data for the selected date range. Please try again.');
                })
                .finally(() => {
                    setLineLoading(false);
                });

        } else if (selectedOptionLine === 'customSelect' && startDateLine && endDateLine) {
            setLineLoading(true);
            setLineError(null);

            const apiUrl = `overall_amount/${startDateLine}/${endDateLine}`;

            axios.get(apiUrl)
                .then((res) => {
                    setLineData(res.data);
                    console.log("Line Chart Response data:", res.data);
                })
                .catch((error) => {
                    console.error('Error fetching data for the selected date range:', error);
                    setLineError('Error fetching data for the selected date range. Please try again.');
                })
                .finally(() => {
                    setLineLoading('Loading..');
                });
        }
    }, [selectedOptionLine, startDateLine, endDateLine]);




    var dateArray = LineData?.dates;
    var dateArrays = BarData?.dates;



    return (
        <>
            {/* <WidgetsDropdown /> */}


            <CRow>
                <CCol xs={12} md={6}>
                    <CCard className="mb-4 pieChart">
                        <CCardHeader>Overall Sales</CCardHeader>
                        <div className="mb-3 optionType ms-auto">
                            <label htmlFor="selectInput" className="form-label">Filter Date</label>
                            <select
                                id="selectInput"
                                className="form-select form-select-sm"
                                value={selectedOption}
                                onChange={handleSelectChange}
                            >
                                <option value="">Select an option</option>
                                <option value="lastweek">Last 7 Days</option>
                                <option value="lastmonth">Last Month</option>
                                <option value="last3months">Last 3 Months</option>
                                <option value="customSelect">Custom Select</option>
                            </select>
                            {selectedOption === 'customSelect' && (
                                <div className='calen_form'>
                                    <label htmlFor="startDate" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="form-control"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <label htmlFor="endDate" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="form-control"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            )}

                        </div>
                        <CCardBody>
                            {/* Render the chart component using the chartData */}
                            <div className='load'>{pieloading && <PacmanLoader color="#d63642" />}</div>

                            {pieerror && <p>{pieerror}</p>}
                            {!pieloading && !pieerror && chartData && (
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
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>


                <CCol xs={12} md={6}>
                    <CCard className="mb-4 BarChart">
                        <CCardHeader>Overall total price</CCardHeader>
                        <div className='mb-3 optionType ms-auto'>
                            <label htmlFor='selectInput' className='form-label'>Filter Data</label>
                            <select
                                id="selectInput"
                                className='form-select form-select-sm'
                                value={selectedOptionBar}
                                onChange={handleoptionBar}
                            >
                                <option value="">Select an option</option>
                                <option value="lastweek">Last 7 Days</option>
                                <option value="lastmonth">Last Month</option>
                                <option value="last3months">Last 3 Months</option>
                                <option value="customSelect">Custom Select</option>
                            </select>
                            {selectedOptionBar === 'customSelect' && (
                                <div className='calen_form'>
                                    <label htmlFor="startDateBar" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDateBar"
                                        className="form-control"
                                        value={startDateBar}
                                        onChange={(e) => setStartDateBar(e.target.value)}
                                    />
                                    <label htmlFor="endDateBar" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        id="endDateBar"
                                        className="form-control"
                                        value={endDateBar}
                                        onChange={(e) => setEndDateBar(e.target.value)}
                                    />
                                </div>
                            )}


                        </div>
                        <CCardBody>
                            <div className='load'>
                                {loading && <PacmanLoader color="#d63642" />}
                            </div>
                            {errorBar && <p>{errorBar}</p>}
                            {!loading && !errorBar && BarData && (
                                <CChartBar
                                    className='smallBarChart'
                                    data={{
                                        labels: dateArrays,
                                        datasets: [
                                            {
                                                label: 'Overall total price',
                                                data: BarData.amounts,
                                                backgroundColor: 'green',
                                            }
                                        ],
                                    }}
                                    labels="months"
                                />
                            
                               
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
                <div>
                    <CCol xs={12}>
                        <CCard className="mb-4">
                            <CCardHeader>Overall Amount</CCardHeader>
                            <div className="mb-3 optionType ms-auto">
                                <label htmlFor="selectInput" className="form-label">Filter Date</label>
                                <select
                                    id="selectInput"
                                    className="form-select form-select-sm"
                                    value={selectedOptionLine}
                                    onChange={handleSelectLine}
                                >
                                    <option value="">Select an option</option>
                                    <option value="lastweek">Last 7 Days</option>
                                    <option value="lastmonth">Last Month</option>
                                    <option value="last3months">Last 3 Months</option>
                                    <option value="customSelect">Custom Select</option>
                                </select>
                                {selectedOptionLine === 'customSelect' && (
                                    <div className='calen_form'>
                                        <label htmlFor="startDateLine" className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            id="startDateLine"
                                            className="form-control"
                                            value={startDateLine}
                                            onChange={(e) => setStartDateLine(e.target.value)}
                                        />
                                        <label htmlFor="endDateBar" className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            id="endDateLine"
                                            className="form-control"
                                            value={endDateLine}
                                            onChange={(e) => setEndDateLine(e.target.value)}
                                        />
                                    </div>
                                )}

                            </div>
                            <CCardBody>
                                
                                    <div className='load'>{lineloading && <PacmanLoader color="#d63642" />}</div>
                              { !lineloading && !lineerror && LineData &&  (
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
                               
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </div>




            </CRow >

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
