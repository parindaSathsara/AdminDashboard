import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormLabel,
  CButton,
  CRow,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import axios from 'axios'
import Swal from 'sweetalert2'
import LoaderPanel from 'src/Panels/LoaderPanel'

import OrderCheckoutsReport from './OrderCheckouts/OrderCheckoutsReport'

import LifestylesCategoryData from './CategoryData/LifestylesCategoryData'
import EssentialsCategoryData from './CategoryData/EssentialsCategoryData'
import EducationCategoryData from './CategoryData/EducationCategoryData'

import CustomersData from './CustomersData/CustomersData'

import 'react-datepicker/dist/react-datepicker.css'
import './ReportsMain.css'
import getChatServices from './services/getChatServices'
import ChatReportData from './ChatData/ChatReportData'
import Modal from 'react-bootstrap/Modal'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import { CurrencyContext } from 'src/Context/CurrencyContext'

const ReportGenerationPage = () => {
  const [reportLoading, setReportLoading] = useState(false);

  const { userData } = useContext(UserLoginContext)

  const { currencyData } = useContext(CurrencyContext)

  console.log(currencyData?.base, 'Currency Base is')

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [category, setCategory] = useState(null)
  const [reportType, setReportType] = useState(null)
  const [order, setOrder] = useState(null)

  console.log(reportType, 'Report Type is')

  const [reportDataSet, setReportDataSet] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateType, setDateType] = useState('service_date')
  const [validationErrors, setValidationErrors] = useState({})
  const [statusOrderDropdown, setStatusOrderDropdown] = useState(true)
  const [statusDate, setStatusDate] = useState(false)
  const [currency, setCurrency] = useState({
    value: currencyData?.base,
    label: currencyData?.base,
  })
  const [currencyType, setCurrencyType] = useState(null)
  const [reportData, setReportData] = useState({})
  const [typeDate, setTypeDate] = useState(null)

  // useEffect(() => {
  //     if(category?.value === '1' &&  reportType?.value === 'pnl'){
  //         setStatusOrderDropdown(false)
  //         setStatusDate(true)
  //     }else{
  //         setStatusOrderDropdown(true)
  //         setOrder(null)
  //         setStatusDate(false)
  //     }
  // }, [category,reportType]);

  useEffect(() => {
    setCurrency({
      value: currencyData?.base,
      label: currencyData?.base,
    })
  }, [currencyData?.base])

  const [categories, setCategories] = useState([
    { value: '0', label: 'Summary' },
    { value: '1', label: 'Detail' },
  ])

  const [categories2, setCategories2] = useState([
    { value: '0', label: 'Order' },
    { value: '1', label: 'product' },
  ])

  const [categories3, setCategories3] = useState([
    { value: '0', label: 'category' },
    { value: '1', label: 'order' },
  ])

  const [categories4, setCategories4] = useState([{ value: '0', label: 'product' }])

  const [Orders, setOrders] = useState([
    { value: '131', label: '131' },
    { value: '132', label: '132' },
  ])

  const [currencies, setCurrencies] = useState([
    { value: 'all', label: 'ALL' },
    { value: 'USD', label: 'USD' },
    { value: 'LKR', label: 'LKR' },
    { value: 'INR', label: 'INR' },
    { value: 'SGD', label: 'SGD' },
    { value: 'MYR', label: 'MYR' },
  ])

  const [currencieType, setCurrencieType] = useState([
    { value: 'all', label: 'ALL' },
    { value: 'payable', label: 'Payable' },
    { value: 'receivable', label: 'Receivable' },
  ])

  const [TypeDates, setDateTypes] = useState([
    { value: 'service_date', label: 'Service Date' },
    { value: 'booked_date', label: 'Booked Date' },
  ])

  const [chatCategories, setChatCategories] = useState([
    { value: '0', label: 'All Categories' },
    { value: '1', label: 'Active Chats' },
    { value: '2', label: 'DeActive Chats' },
  ])

  const reportTypes = [
    { value: 'pnl', label: 'PNL Report (Summary)' },
    { value: 'payable', label: 'Payable Report' },
    { value: 'receivable', label: 'Receivable Report' },
    { value: 'cashflow', label: 'CashFlow' },
    { value: 'api', label: 'API' },
  ]

  const [providerOptions, setProviderOptions] = useState([
  { value: 'tbo_holidays', label: 'TBO Holidays' },
  { value: 'tbo_india', label: 'TBO India' },
  { value: 'ratehawk', label: 'Ratehawk' },
  { value: 'aahaas', label: 'Aahaas' },
  { value: 'bridgify', label: 'Bridgify' },
]);

  const [dataEmptyState, setDataEmptyState] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerShow, setProviderShow] = useState(null);

  useEffect(() => {
  if (reportType?.value === 'api') {
    setProviderShow(true);
  } else {
    setProviderShow(false);
    setSelectedProvider(null); // Reset provider when changing report type
  }
}, [reportType]);


  const handleGenerateReport = async () => {
    setReportLoading(true); // Start loading

    const errors = {}
    console.log('currency', currency);
     if (reportType?.value === 'api' && !selectedProvider) {
    errors.provider = 'Provider is required for API reports';
  }
  
    if (!reportType) {
      console.log('No report type selected');
      errors.reportType = 'Report type is required';
      if (!category) errors.category = 'Category is required';
      if (!currencyType) errors.currencyType = 'Currency type is required';
    } else {
      switch (reportType?.value) {
        case 'pnl':
          console.log('pnl');
          if (category.length === 0) errors.category = 'Category is required';
          break;
        case 'payable':
          console.log('payable');
          if (category.length === 0) errors.category = 'Category is required';
          if (!currencyType) errors.currencyType = 'Currency type is required';
          if (reportType?.value === 'payable' && currencyType?.value != 'all' && !currency?.value) errors.currency = 'Currency type is required';
          break;

        case 'receivable':
          console.log('receivable');
          if (category.length === 0) errors.category = 'Category is required';
          if (!currency?.value) errors.currency = 'Currency type is required';
          break;

        case 'cashflow':
          console.log('cashflow', currency);
          if (category.length === 0) errors.category = 'Category is required';
          if (!currency?.value) errors.currency = 'Currency type is required';
          break;

        default:
          console.log('Unknown report type');
      }
    }

    if (!category) errors.category = 'Category is required';
    if (!startDate) errors.startDate = 'Start date is required'
    if (!endDate) errors.endDate = 'End date is required'
    if (!typeDate) errors.typeDate = 'Date type is required'
    if (startDate && endDate) {
      const start = moment(startDate)
      const end = moment(endDate)
      if (start.isAfter(end)) {
        errors.startDate = 'Start date cannot be later than end date'
      }
    }

    if (!reportType) errors.reportType = 'Report type is required'
    if (!category) errors.category = 'Category is required'

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setReportLoading(false); // Stop loading if validation fails
      return
    }

    const dataSet = {
      start: moment(startDate).format('YYYY-MM-DD'),
      end: moment(endDate).format('YYYY-MM-DD'),
      category: category?.value,
      reportType: reportType?.value,
      // orderId: order?.value,
      dateType: dateType,
      currencyValue: currency?.value,
      currencyType: currencyType?.value,
      dateType: typeDate?.value,
      provider: selectedProvider?.value, // Add this line

    }

    console.log(dataSet, 'Data set value is data')
    setReportData(dataSet)
    // handlePNLReport(dataSet)
    try {
      await handlePNLReport(dataSet);
    } catch (error) {
      console.error('Error generating report:', error);
      Swal.fire({
        text: 'Failed to generate report',
        icon: 'error',
      });
    } finally {
      setReportLoading(false); // Stop loading whether success or error
    }
  }

  const [PNLVoucherView, setPNLVoucherView] = useState(false)
  const [currenctOrdeId, setCurrenctOrderId] = useState('')
  const [productPNLReport, setProductPNLReport] = useState([])

  const returnURL = (data, dataType) => {
    let url
    if (data.reportType === 'pnl' && data.category === '0') {
      console.log(data, "Data =>");
      console.log('Data pnl by categories')
      url = `pnl/by-categories${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&dateType=${data.dateType}`
    } else if (data.reportType === 'pnl' && data.category === '1') {
      console.log('Data pnl by orders')
      url = `pnl/by-orders${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&dateType=${data.dateType}`
      console.log(url, "PNL Report URL");

    } else if (data.reportType === 'payable' && data.category === '0') {
      url = `payable/summary${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&dateType=${data.dateType}&currencyType=${data.currencyType}&currencyValue=${data.currencyValue
        }`
    } else if (data.reportType === 'payable' && data.category === '1') {
      url = `payable/detailed${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&dateType=${data.dateType}&currencyType=${data.currencyType}&currencyValue=${data.currencyValue
        }`
    } else if (data.reportType === 'receivable' && data.category === '0') {
      url = `receivable/by-orders${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&dateType=${data.dateType}&currencyValue=${data.currencyValue}`
    } else if (data.reportType === 'receivable' && data.category === '1') {
      url = `receivable/by-products${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&dateType=${data.dateType}&currencyValue=${data.currencyValue}`
    } else if (data.reportType === 'cashflow') {
      url = `cash-flow/by-products${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
        }&currencyValue=${data.currencyValue}&dateType=${data.dateType}`
    }
    else if (data.reportType === 'api') {
      // url = `reports/api/html${dataType}?start=${data.start}&end=${data.end}&currency=${data.currency || currencyData?.base
      //   }&dateType=${data.dateType}&provider=${data.provider}`;
      url = `reports/api${dataType ? dataType : "/html"}?start=${data.start}&end=${data.end}&dateType=${data.dateType}&provider=${data.provider}`;
    }

    return url
  }

  // const handlePNLReport = async (data) => {
  //   console.log(data, 'Data')
  //   let url

  //   url = returnURL(data, '')

  //   // setPNLVoucherView(true)
  //   await axios
  //     .get(url)
  //     .then((response) => {
  //       setPNLVoucherView(true)
  //       // setCurrenctOrderId(id);
  //       // console.log(response.data, "response data")
  //       setProductPNLReport(response.data)


  //     })
  //     .catch((error) => {
  //       Swal.fire({
  //         text: 'Failed to Proceed the PDF',
  //         icon: 'error',
  //       })
  //       console.log(error);

  //     })
  // }
  const handlePNLReport = async (data) => {
    console.log(data, 'Data')
    let url = returnURL(data, '')

    const response = await axios.get(url);
    setPNLVoucherView(true)
    setProductPNLReport(response.data)
  }

  const handleCLosePNRLReportModal = () => {
    setPNLVoucherView(false)
    setCurrenctOrderId('')
    setProductPNLReport([])
  }

  const downloadPdf = async () => {
    try {
      const data = reportData

      console.log(data, 'data set report is')
      let url

      url = returnURL(data, '/pdf')

      console.log('URL', url, 'URL Value issss')
      window.location.href = `${axios.defaults.baseURL}/${url}`
      //  const response = await axios.get(url);
      //  const blob = new Blob([response.data], { type: 'application/pdf' });
      //  const link = document.createElement('a');
      //  link.href = window.URL.createObjectURL(blob);
      //  link.download = `PNL_report-${data.reportType}.pdf`;
      //  link.click();
    } catch (error) {
      console.error('Error downloading the PDF:', error)
    }
  }

  const downloadExcel = async () => {
    try {
      const data = reportData
      let url
      url = returnURL(data, '/excel')
      console.log('URL excel is', url)
      window.location.href = `${axios.defaults.baseURL}/${url}`
    } catch (error) {
      console.error('Error downloading the Excel:', error)
    }
  }

  const [currencyStatus, setCurrencyStatus] = useState(false)

  useEffect(() => {
    console.log('aaaaaaaaaaaaaa')
    if (currencyType?.value !== 'all') {
      setCurrencyStatus(true)
    } else {
      setCurrencyStatus(false)
    }
  }, [currencyType])

  const [status, setStatus] = useState(true)

  //   useEffect(() => {
  //     console.log('receivablelll')
  //     if (reportType?.value === 'receivable') {
  //         console.log('receivable')
  //       setStatus(false)
  //     } else {
  //       setStatus(true)
  //     }
  //   }, [reportType])

  //   useEffect(() => {
  //     console.log('receivablelll')
  //     if (reportType?.value === 'cashflow') {
  //         console.log('receivable')
  //       setStatus(false)
  //     } else {
  //       setStatus(true)
  //     }
  //   }, [reportType])

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

  // useEffect(() => {
  //     setReportDataSet([]);
  // }, [startDate, endDate, reportType, category]);

  // const download = async () => {
  //     console.log('Download PDF');
  //     window.location.href = `${axios.defaults.baseURL}/pnl/by-categories/pdf?start=2024-09-10&end=2024-11-22&currancy=LKR`;
  // }

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
                <Select
                  options={reportTypes}
                  value={reportType}
                  onChange={(selectedOption) => {
                    setReportType(selectedOption)
                    setCategory([])
                    setCurrency(null)
                    setEndDate(null)
                    setStartDate(null)
                    // setCurrency(null)
                    setCurrencyType(null)
                    setTypeDate(null)
                    setSelectedProvider(null) // Add this line

                  }}
                  placeholder="Select a Report Type"
                  id="report-type"
                />
                {validationErrors.reportType && (
                  <div className="text-danger">{validationErrors.reportType}</div>
                )}
              </CCol>
              {reportType?.value === 'api' ? null : <CCol xs={12} sm={6} lg={2}>
                <CFormLabel htmlFor="category">Category</CFormLabel>
                <br />
                <Select
                  options={
                    reportType?.value === 'receivable'
                      ? categories2
                      : reportType?.value === 'pnl'
                        ? categories3
                        : reportType?.value === 'cashflow'
                          ? categories4
                          : categories
                  }
                  value={category}
                  onChange={(selectedOption) => {
                    setCategory(selectedOption)
                  }}
                  placeholder="Select a category"
                  id="category"
                  isDisabled={reportType !== null ? false : true}
                />
                {validationErrors.category && (
                  <div className="text-danger">{validationErrors.category}</div>
                )}
              </CCol> }
              {reportType?.value === 'api' ? (
  <CCol xs={12} sm={6} lg={2}>
    <CFormLabel htmlFor="provider">Provider</CFormLabel>
    <br />
    <Select
      options={providerOptions}
      value={selectedProvider}
      onChange={(selectedOption) => {
        setSelectedProvider(selectedOption)
      }}
      placeholder="Select a Provider"
      id="provider"
    />
    {validationErrors.provider && (
      <div className="text-danger">{validationErrors.provider}</div>
    )}
  </CCol>
) : null}
              {/* <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="category">Order Id</CFormLabel>
                                <br />
                                <Select options={Orders} value={order} onChange={selectedOption => setOrder(selectedOption)} placeholder="Select a Order" id="order"   isDisabled={statusOrderDropdown} />
                                {validationErrors.order && <div className="text-danger">{validationErrors.order}</div>}
                            </CCol> */}
              {reportType?.value == 'payable' ? (
                <CCol xs={12} sm={6} lg={2}>
                  <CFormLabel htmlFor="currencyType">Currency Type</CFormLabel>
                  <br />
                  <Select
                    options={currencieType}
                    value={currencyType}
                    onChange={(selectedOption) => {
                      setCurrencyType(selectedOption)
                    }}
                    placeholder="Select a Currency Type"
                    id="currencyType"
                  />
                  {validationErrors.currencyType && (
                    <div className="text-danger">{validationErrors.currencyType}</div>
                  )}
                </CCol>
              ) : null}

              {(reportType?.value === 'payable' && currencyType?.value === 'all') || reportType?.value === 'api'  ? (
                null
              ) : (reportType?.value != 'pnl' ? (
                <CCol xs={12} sm={6} lg={2}>
                  <CFormLabel htmlFor="currency">Currency</CFormLabel>
                  <br />
                  <Select
                    options={currencies?.filter((res) => {
                      if (reportType?.value === 'payable') {
                        return res.value !== 'all'
                      } else {
                        return res
                      }
                    })}
                    value={currency}
                    onChange={(selectedOption) => {
                      setCurrency(selectedOption)
                    }}
                    placeholder="Select a Currency"
                    id="currency"
                  />
                  {validationErrors.currency && (
                    <div className="text-danger">{validationErrors.currency}</div>
                  )}
                </CCol>
              ) : null)
              }

              <CCol xs={12} sm={6} lg={2}>
                <CFormLabel htmlFor="typeDate">Date Type</CFormLabel>
                <br />
                <Select
                  options={TypeDates}
                  value={typeDate}
                  onChange={(selectedOption) => {
                    setTypeDate(selectedOption)
                  }}
                  placeholder="Select a Date Type"
                  id="typeDate"
                />
                {validationErrors.typeDate && (
                  <div className="text-danger">{validationErrors.typeDate}</div>
                )}
              </CCol>

              <>
                <CCol xs={12} sm={6} lg={3}>
                  <CFormLabel htmlFor="start-date">Start Date</CFormLabel>
                  <br />
                  <DatePicker
                    disabled={statusDate}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control full-width"
                    placeholderText="Select start date"
                    id="start-date"
                  />
                  {validationErrors.startDate && (
                    <div className="text-danger">{validationErrors.startDate}</div>
                  )}
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                  <CFormLabel htmlFor="end-date" style={{ marginTop: "4%" }}>End Date</CFormLabel>
                  <br />
                  <DatePicker
                    disabled={statusDate}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="form-control full-width"
                    placeholderText="Select end date"
                    id="end-date"
                  />
                  {validationErrors.endDate && (
                    <div className="text-danger">{validationErrors.endDate}</div>
                  )}
                </CCol>
              </>

              <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                {['generate account report', 'all accounts access'].some((permission) =>
                  userData?.permissions?.includes(permission),
                ) && (
                    // <CButton color="dark" className="full-width" onClick={handleGenerateReport}>
                    //   Generate Report
                    // </CButton>
                    <CButton
                      color="dark"
                      className="full-width"
                      onClick={handleGenerateReport}
                      disabled={reportLoading}
                    >
                      {reportLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span className="visually-hidden">Loading...</span>
                          Generating...
                        </>
                      ) : (
                        "Generate Report"
                      )}
                    </CButton>
                  )}
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

      {/* {

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
            } */}

      <Modal
        style={{ maxHeight: '95%' }}
        show={PNLVoucherView}
        size="xl"
        onHide={handleCLosePNRLReportModal}
      >
        <Modal.Header closeButton>
          {/* <Modal.Title>Account Report</Modal.Title> */}
          <Modal.Title>
            {reportLoading ? "Generating Report..." : "Account Report"}
          </Modal.Title>
          {/* {
            // (productPNLReport.status !== 'fail' && productPNLReport.message !== 'No data to display') &&
            <CButton
              color="info"
              style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }}
              onClick={downloadPdf}
            >
              Download PDF
            </CButton>
          } */}
          {!reportLoading && productPNLReport.status !== 'fail' && (

            <CDropdown style={{ marginLeft: "68%" }} variant="btn-group">
              <CDropdownToggle color="success">Download File</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem style={{ cursor: 'pointer' }} onClick={() => downloadPdf()}>
                  Download PDF
                </CDropdownItem>

                <CDropdownItem style={{ cursor: 'pointer' }} onClick={() => downloadExcel()}>
                  Download Excel
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          )}
        </Modal.Header>
        <Modal.Body>
          {reportLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Generating report...</p>
            </div>
          ) : productPNLReport.status === 'fail' &&
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
    </CContainer>
  )
}

export default ReportGenerationPage
