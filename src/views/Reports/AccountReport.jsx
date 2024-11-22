import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CFormLabel, CButton, CRow, CFormCheck } from '@coreui/react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import axios from "axios"

import LoaderPanel from 'src/Panels/LoaderPanel';

import OrderCheckoutsReport from './OrderCheckouts/OrderCheckoutsReport';

import LifestylesCategoryData from './CategoryData/LifestylesCategoryData';
import EssentialsCategoryData from './CategoryData/EssentialsCategoryData';
import EducationCategoryData from './CategoryData/EducationCategoryData';

import CustomersData from './CustomersData/CustomersData';

import 'react-datepicker/dist/react-datepicker.css';
import './ReportsMain.css';
import getChatServices from './services/getChatServices';
import ChatReportData from './ChatData/ChatReportData';
import Modal from 'react-bootstrap/Modal';

const ReportGenerationPage = () => {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [category, setCategory] = useState(null);
    const [reportType, setReportType] = useState(null);
    const [order, setOrder] = useState(null);

    const [reportDataSet, setReportDataSet] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateType, setDateType] = useState('service_date');
    const [validationErrors, setValidationErrors] = useState({});
    const [statusOrderDropdown, setStatusOrderDropdown] = useState(true);
    const [statusDate, setStatusDate] = useState(false);
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        if(category?.value === '1' &&  reportType?.value === 'pnl'){
            setStatusOrderDropdown(false)
            setStatusDate(true)
        }else{
            setStatusOrderDropdown(true)
            setOrder(null)
            setStatusDate(false)
        }
    }, [category,reportType]);

    useEffect (()=>{

    },[])

    const [categories, setCategories] = useState([
        { value: '0', label: 'Summery' },
        { value: '1', label: 'Detail' },
    ]);

    const [Orders, setOrders] = useState([
        { value: '131', label: '131' },
        { value: '132', label: '132' },
    ]);

    const [currencies, setCurrencies] = useState([
        { value: 'USD', label: 'USD' },
        { value: 'LKR', label: 'LKR' },
        { value: 'INR', label: 'INR' },
    ]);


    const [chatCategories, setChatCategories] = useState([
        { value: '0', label: 'All Categories' },
        { value: '1', label: 'Active Chats' },
        { value: '2', label: 'DeActive Chats' },
    ])

    const reportTypes = [
        { value: 'pnl', label: 'PNL Report' },
        { value: 'payable', label: 'Payable Report' },
        { value: 'receivable', label: 'Receivable Report' },
    ];

    const [dataEmptyState, setDataEmptyState] = useState(false);

    const handleGenerateReport = async () => {

        const errors = {};
        if (!startDate && statusDate === false) errors.startDate = 'Start date is required'
        if (category?.value === '1' &&  reportType?.value === 'pnl' && !order) errors.order = 'Order is required';
        if (!currency) errors.currency = 'Currency type is required';
        if (!endDate && statusDate === false) errors.endDate = 'End date is required';
        if (!reportType) errors.reportType = 'Report type is required';
        if (!category || category.value === '' || category.value === 0) errors.category = 'Category is required';

        if (startDate && endDate) {
            const start = moment(startDate);
            const end = moment(endDate);
            if (start.isAfter(end)) {
                errors.startDate = 'Start date cannot be later than end date';
            }
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const dataSet = {
            start: moment(startDate).format('YYYY-MM-DD'),
            end: moment(endDate).format('YYYY-MM-DD'),
            // category: category?.value,
            // reportType: reportType?.value,
            // orderId: order?.value,
            // dateType: dateType,
            currency: currency?.value
        };


        console.log(dataSet, "Data set value is data")
        handlePNLReport(dataSet);

    };

    const [PNLVoucherView, setPNLVoucherView] = useState(false);
    const [currenctOrdeId, setCurrenctOrderId] = useState('');
    const [productPNLReport, setProductPNLReport] = useState([]);

    const handlePNLReport = async (data) => {
        // setPNLVoucherView(true)
        await axios.get(`payable/detailed?start=${data.start}&end=${data.end}&currancy=${data.currency}`).then((response) => {
            setPNLVoucherView(true);
            // setCurrenctOrderId(id);
        console.log(response.data, "response data")
            setProductPNLReport(response.data)
        })
    }

    const handleCLosePNRLReportModal = () => {
        setPNLVoucherView(false);
        setCurrenctOrderId('');
        setProductPNLReport([]);
    }

    // useEffect(() => {
    //     if (reportType?.value === 'orders_report') {
    //         setCategories([
    //             { value: '0', label: 'All Categories' },
    //             { value: '1', label: 'Essentials' },
    //             { value: '2', label: 'Non Essentials' },
    //             { value: '3', label: 'Lifestyles' },
    //             { value: '5', label: 'Education' },
    //             { value: '4', label: 'Hotels' },
    //         ]);
    //     }
    //     else if (reportType?.value === 'chats_report') {
    //         setChatCategories([
    //             { value: '0', label: 'All Categories' },
    //             { value: '1', label: 'Active Chats' },
    //             { value: '2', label: 'DeActive Chats' },
    //         ])
    //     } else {
    //         setCategories([
    //             { value: '1', label: 'Essentials' },
    //             { value: '2', label: 'Non Essentials' },
    //             { value: '3', label: 'Lifestyles' },
    //             { value: '5', label: 'Education' },
    //             { value: '4', label: 'Hotels' },
    //         ]);
    //     }
    // }, [reportType]);

    useEffect(() => {
        setReportDataSet([]);
    }, [startDate, endDate, reportType, category]);



    return (
        <CContainer fluid>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Account Report Generation</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="align-items-end">
                        <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="report-type">Report Type</CFormLabel>
                                <br />
                                <Select options={reportTypes} value={reportType} onChange={selectedOption => {
                                    setReportType(selectedOption);
                                    setCategory([]);
                                    setOrder([]);
                                }}
                                    placeholder="Select a Report Type" id="report-type" />
                                {validationErrors.reportType && <div className="text-danger">{validationErrors.reportType}</div>}
                            </CCol>
                            <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="category">Category</CFormLabel>
                                <br />
                                <Select options={categories} value={category} onChange={selectedOption => {
                                    setCategory(selectedOption)
                                    }} placeholder="Select a category" id="category" isDisabled={reportType !== null ? false : true} />
                                {validationErrors.category && <div className="text-danger">{validationErrors.category}</div>}
                            </CCol>
                            <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="category">Order Id</CFormLabel>
                                <br />
                                <Select options={Orders} value={order} onChange={selectedOption => setOrder(selectedOption)} placeholder="Select a Order" id="order"   isDisabled={statusOrderDropdown} />
                                {validationErrors.order && <div className="text-danger">{validationErrors.order}</div>}
                            </CCol>
                            <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="currency">Currency</CFormLabel>
                                <br />
                                <Select options={currencies} value={currency} onChange={selectedOption => {
                                    setCurrency(selectedOption)
                                    }} placeholder="Select a Currency" id="currency" />
                                {validationErrors.currency && <div className="text-danger">{validationErrors.currency}</div>}
                            </CCol>
                            
                           
                                    <> 
                                <CCol xs={12} sm={6} lg={3}>
                                    <CFormLabel htmlFor="start-date">Start Date</CFormLabel>
                                    <br />
                                    <DatePicker disabled={statusDate} selected={startDate} onChange={date => setStartDate(date)} className="form-control full-width" placeholderText="Select start date" id="start-date" />
                                    {validationErrors.startDate && <div className="text-danger">{validationErrors.startDate}</div>}
                                </CCol>
                                <CCol xs={12} sm={6} lg={3}>
                                    <CFormLabel htmlFor="end-date">End Date</CFormLabel>
                                    <br />
                                    <DatePicker  disabled={statusDate} selected={endDate} onChange={date => setEndDate(date)} className="form-control full-width" placeholderText="Select end date" id="end-date" />
                                    {validationErrors.endDate && <div className="text-danger">{validationErrors.endDate}</div>}
                                </CCol>
                                </>
                            
                          
                           
                            
                            <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                                <CButton color="dark" className="full-width" onClick={handleGenerateReport}>Generate Report</CButton>
                            </CCol>
                        </CRow>

                        {/* {
                            reportType?.value === 'orders_report' &&
                            <CRow className="mt-3">
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="date-type">Date Type</CFormLabel>
                                    <br />
                                    <CFormCheck inline type="radio" id="service_date" name="dateType" value="service_date" label="Service Date" checked={dateType === 'service_date'} onChange={() => setDateType('service_date')} />
                                    <CFormCheck inline type="radio" id="booking_date" name="dateType" value="booking_date" label="Booking Date" checked={dateType === 'booking_date'} onChange={() => setDateType('booking_date')} />
                                </CCol>
                            </CRow>
                        } */}

                    </CCardBody>
                </CCard>
            </CCol>

            {

                loading ? <LoaderPanel message="Report Data Fetching" /> :
                    reportDataSet.length > 0 ?
                        reportType?.value === 'products_report' ?
                            category.value == 3 ?
                                <LifestylesCategoryData data={reportDataSet} />
                                : (category.value == 1 || category.value == 2) ?
                                    <EssentialsCategoryData data={reportDataSet} category={category.value} />
                                    : category.value == 5 ?
                                        <EducationCategoryData data={reportDataSet} />
                                        : null
                            : reportType.value === "customer_report" ?
                                <CustomersData dataSet={reportDataSet} category={category.value} />
                                :
                                reportType?.value === 'chats_report' ?
                                    <ChatReportData dataSet={reportDataSet} category={category.value} />
                                    : <OrderCheckoutsReport dataSet={reportDataSet} category={category.value} />
                        :
                        dataEmptyState ? <h5 style={{ marginTop: 15 }}>Report Data is Empty</h5>
                            : null
            }


        <Modal show={PNLVoucherView} size="xl" onHide={handleCLosePNRLReportModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Account Report</Modal.Title>
                    {/* {
                        (productPNLReport.status !== 'fail' && productPNLReport.message !== 'No data to display') &&
                        <CButton color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }} onClick={downloadPdf}>Download Voucher</CButton>
                    } */}
                </Modal.Header>
                <Modal.Body>
                    {
                        (productPNLReport.status === 'fail' && productPNLReport.message === 'No data to display') ?
                            <div className='d-flex flex-column align-items-center my-5'>
                                <h6>Oops! Sorry</h6>
                                <p>The product has been yet to be approved !</p>
                            </div>
                            :
                            <div dangerouslySetInnerHTML={{ __html: productPNLReport }} />
                    }
                </Modal.Body>
            </Modal>

        </CContainer>
    );
};

export default ReportGenerationPage;
