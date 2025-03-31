import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CFormLabel, CButton, CRow, CFormCheck } from '@coreui/react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import LoaderPanel from 'src/Panels/LoaderPanel';

import OrderCheckoutsReport from './OrderCheckouts/OrderCheckoutsReport';
import { getReports } from './services/reportingServices';

import LifestylesCategoryData from './CategoryData/LifestylesCategoryData';
import EssentialsCategoryData from './CategoryData/EssentialsCategoryData';
import EducationCategoryData from './CategoryData/EducationCategoryData';

import CustomersData from './CustomersData/CustomersData';

import 'react-datepicker/dist/react-datepicker.css';
import './ReportsMain.css';
import getChatServices from './services/getChatServices';
import ChatReportData from './ChatData/ChatReportData';

import DriverAllocationData from './CategoryData/DriverAllocationData';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import HotelsCategoryData from './CategoryData/HotelsCategoryData';


const ReportGenerationPage = () => {
  const { userData } = useContext(UserLoginContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState({ value: 0 });
  const [reportType, setReportType] = useState(null);

  const [reportDataSet, setReportDataSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateType, setDateType] = useState('service_date');
  const [validationErrors, setValidationErrors] = useState({});

  const [categories, setCategories] = useState([
    { value: '0', label: 'All Categories' },
    { value: '1', label: 'Essentials' },
    { value: '2', label: 'Non Essentials' },
    { value: '3', label: 'Lifestyles' },
    { value: '5', label: 'Education' },
    { value: '4', label: 'Hotels' },
  ]);

  const [chatCategories, setChatCategories] = useState([
    { value: '0', label: 'All Categories' },
    { value: '1', label: 'Active Chats' },
    { value: '2', label: 'DeActive Chats' },
  ])

  const reportTypes = [
    { value: 'products_report', label: 'Products Report' },
    { value: 'orders_report', label: 'Orders Report' },
    { value: 'customer_report', label: 'Customer Report' },
    { value: 'chats_report', label: 'Chats Report' },
    { value: 'driver_allocation', label: 'Driver Allocation' },
  ];

  const [dataEmptyState, setDataEmptyState] = useState(false);

  const handleGenerateReport = async () => {

    const errors = {};
    if (!startDate) errors.startDate = 'Start date is required';
    if (!endDate) errors.endDate = 'End date is required';
    if (!reportType) errors.reportType = 'Report type is required';
    if (!category || category.value === '' || category.value === 0) errors.category = 'Category is required';

    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      if (start.isAfter(end)) {
        errors.startDate = 'Start date cannot be later than end date';
      }
    }

    console.log(category, "Category value is")

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const dataSet = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      category: category.value,
      reportType: reportType.value,
      dateType: dateType
    };


    console.log(dataSet, "Data set value is data")

    setLoading(true);
    if (reportType?.value === 'chats_report') {
      await getChatServices(dataSet).then((response) => {
        setReportDataSet(response);
        // console.log(response);
        setLoading(false);
      });
    } else {
      await getReports(dataSet).then(response => {
        // console.log(response);
        setReportDataSet(response);
        setLoading(false);
        if (response?.length === 0) {
          setDataEmptyState(true);
        } else {
          setDataEmptyState(false);
        }
      }).catch(() => {
        setLoading(false);
      });
    }

  };

  useEffect(() => {
    if (reportType?.value === 'orders_report') {
      setCategories([
        { value: '0', label: 'All Categories' },
        { value: '1', label: 'Essentials' },
        { value: '2', label: 'Non Essentials' },
        { value: '3', label: 'Lifestyles' },
        { value: '5', label: 'Education' },
        { value: '4', label: 'Hotels' },
      ]);
    }
    else if (reportType?.value === 'chats_report') {
      setChatCategories([
        { value: '0', label: 'All Categories' },
        { value: '1', label: 'Active Chats' },
        { value: '2', label: 'DeActive Chats' },
      ])
    } else if (reportType?.value === 'driver_allocation') { //handle driver allocation report selection
      setCategories([
        { value: '3', label: 'Lifestyles' },
      ]);
      setCategory({ value: '3', label: 'Lifestyles' });

    } else {
      setCategories([
        { value: '1', label: 'Essentials' },
        { value: '2', label: 'Non Essentials' },
        { value: '3', label: 'Lifestyles' },
        { value: '5', label: 'Education' },
        { value: '4', label: 'Hotels' },
      ]);
    }
  }, [reportType]);

  useEffect(() => {
    setReportDataSet([]);
  }, [startDate, endDate, reportType, category]);

  return (
    <CContainer fluid>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Report Generation</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="align-items-end">
              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="start-date">Start Date</CFormLabel>
                <br />
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="form-control full-width" placeholderText="Select start date" id="start-date" />
                {validationErrors.startDate && <div className="text-danger">{validationErrors.startDate}</div>}
              </CCol>
              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="end-date">End Date</CFormLabel>
                <br />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="form-control full-width" placeholderText="Select end date" id="end-date" />
                {validationErrors.endDate && <div className="text-danger">{validationErrors.endDate}</div>}
              </CCol>
              <CCol xs={12} sm={6} lg={2}>
                <CFormLabel htmlFor="report-type">Report Type</CFormLabel>
                <br />
                <Select options={reportTypes} value={reportType} onChange={selectedOption => {
                  setReportType(selectedOption);
                  setCategory([]);
                }}
                  placeholder="Select a Report Type" id="report-type" />
                {validationErrors.reportType && <div className="text-danger">{validationErrors.reportType}</div>}
              </CCol>
              <CCol xs={12} sm={6} lg={2}>
                <CFormLabel htmlFor="category">Category</CFormLabel>
                <br />
                <Select options={reportType?.value === 'chats_report' ? chatCategories : categories} value={category} onChange={selectedOption => setCategory(selectedOption)} placeholder="Select a category" id="category" isDisabled={reportType?.value == "customer_report"} />
                {validationErrors.category && <div className="text-danger">{validationErrors.category}</div>}
              </CCol>
              <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                {(["generate all report", "all accounts access"].some(permission => userData?.permissions?.includes(permission))) &&
                  <CButton color="dark" className="full-width" onClick={handleGenerateReport}>Generate Report</CButton>
                }
              </CCol>

            </CRow>

            {
              (reportType?.value === 'orders_report' || reportType?.value === 'driver_allocation') &&
              <CRow className="mt-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor="date-type" style={{ fontWeight: "bold" }}>Date Type</CFormLabel>
                  <br />
                  <CFormCheck inline type="radio" id="service_date" name="dateType" value="service_date" label="Service Date" checked={dateType === 'service_date'} onChange={() => setDateType('service_date')} />
                  <CFormCheck inline type="radio" id="booking_date" name="dateType" value="booking_date" label="Booking Date" checked={dateType === 'booking_date'} onChange={() => setDateType('booking_date')} />
                </CCol>
              </CRow>
            }

          </CCardBody>
        </CCard>
      </CCol>

      {

        loading ? <LoaderPanel message="Report Data Fetching" /> :
          reportDataSet.length > 0 ?
            reportType?.value === 'driver_allocation' ?
              <DriverAllocationData dataSet={reportDataSet} />
              // <p>Test</p>
              :
              reportType?.value === 'products_report' ?
                category.value == 3 ?
                  <LifestylesCategoryData data={reportDataSet} />
                  : (category.value == 1 || category.value == 2) ?
                    <EssentialsCategoryData data={reportDataSet} category={category.value} />
                    : category.value == 5 ?
                      <EducationCategoryData data={reportDataSet} />
                      : category.value == 4 ? <HotelsCategoryData data={reportDataSet} />
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

    </CContainer>
  );
};

export default ReportGenerationPage;
