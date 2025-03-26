import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormLabel,
  CButton,
  CRow
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import axios from 'axios';
import moment from 'moment';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilReload } from '@coreui/icons';
import { confirmResendEmail, downloadAllSupplierVouchers, downloadOrderReceipt, downloadSupplierVoucherOneByOne, getOrderIDs, getOrderIndexIds, resendAllSupplierVouchers } from './services/emailServices';
import RichTextEditor from './RichTextEditor';
import Swal from 'sweetalert2';
import { UserLoginContext } from 'src/Context/UserLoginContext';

const EmailDashboard = () => {
  const { userData } = useContext(UserLoginContext);

  const [searchData, setSearchData] = useState([])
  const [loading, setLoading] = useState(false)

  // const handleGenerateReport = () => {
  //     // Implement the logic to fetch and display the report
  //     // console.log('Generating report for:', { startDate, endDate, category });
  //     const dataSet = {
  //         startDate: moment(startDate).format("YYYY-MM-DD"),
  //         endDate: moment(endDate).format("YYYY-MM-DD"),
  //         category: category["value"],
  //         reportType: reportType["value"]
  //     }

  //     setLoading(true)
  //     getReports(dataSet).then(response => {
  //         setReportDataSet(response)

  //         setLoading(false)
  //     }).catch(response => {
  //         setLoading(false)
  //     })

  // };

  const [emailType, setEmailType] = useState({})
  const [selectedOrderID, setSelectedOrderID] = useState({})
  const [selectedOrderIndexId, setSelectedOrderIndexId] = useState({})






  const [orderIds, setOrderIds] = useState([])

  const [orderIndexIds, setOrderIndexIDs] = useState([]);


  const [orderIndexIdVals, setOrderIndexIdVals] = useState([])

  const handleONCheckoutIDClick = (selectedOption) => {
    setSelectedOrderID(selectedOption);
    setSelectedOrderIndexId({});

    setCheckoutIndexLoading(true);
    getOrderIndexIds(selectedOption?.value).then(response => {


      setOrderIndexIdVals(response)

      var dataSet = response.map(res => ({
        value: res.id,
        label: res.voucher_id
      }));


      // dataSet.unshift({ value: "All", label: "All Checkouts" });

      setCheckoutIndexLoading(false);
      setOrderIndexIDs(dataSet);

    });
  }

  const emailTypes = [
    { value: 'supplier_voucher', label: 'Supplier Voucher' },
    { value: 'customer_invoice', label: 'Customer Invoice' }
  ];



  useEffect(() => {
    getOrderIDs().then(response => {

      var dataSet = response.map(res => ({
        value: res?.id,
        label: `AHS_ORD${res.id}`
      }));

      setOrderIds(dataSet)
    })
  }, [])


  //



  const handleEmailResend = () => {

    const missingFields = [];
    if (!emailType?.value) missingFields.push("Email Type");
    if (!selectedOrderID?.value) missingFields.push("Order ID");

    if (emailType.value !== "customer_invoice" && !selectedOrderIndexId?.value) {
      missingFields.push("Order Index ID");
    }

    if (missingFields.length > 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: `Please select the following fields: ${missingFields.join(', ')}`,
      });
      return;
    }



    if (emailType.value === "customer_invoice") {
      confirmResendEmail(selectedOrderID.value);
    } else {
      resendAllSupplierVouchers(selectedOrderID?.value, selectedOrderIndexId?.value)
    }
  };

  const handleDownloadReceipt = () => {
    const missingFields = [];
    if (!emailType?.value) missingFields.push("Email Type");
    if (!selectedOrderID?.value) missingFields.push("Order ID");

    if (emailType.value !== "customer_invoice" && !selectedOrderIndexId?.value) {
      missingFields.push("Order Index ID");
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: `Please select the following fields: ${missingFields.join(', ')}`,
      });
      return;
    }

    if (emailType.value === "customer_invoice") {
      downloadOrderReceipt(selectedOrderID.value);
    } else {
      if (selectedOrderIndexId.value === "All") {
        downloadAllSupplierVouchers(selectedOrderID.value, orderIndexIdVals);
      } else {
        downloadSupplierVoucherOneByOne(selectedOrderIndexId.value, selectedOrderID.value);
      }
    }
  };



  const [checkoutIndexLoading, setCheckoutIndexLoading] = useState(false)




  return (
    <CContainer fluid>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Download & Resend Emails</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="align-items-end">

              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="category">Email Type</CFormLabel>
                <br></br>
                <Select
                  options={emailTypes}
                  value={emailType}
                  onChange={(selectedOption) => {
                    setEmailType(selectedOption)
                  }}
                  placeholder="Select a Email Type"
                />
              </CCol>

              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="category">Order ID</CFormLabel>

                <br></br>

                <Select
                  options={orderIds}
                  value={selectedOrderID}
                  onChange={(selectedOption) => handleONCheckoutIDClick(selectedOption)}
                  placeholder="Select a Order ID"
                  isSearchable
                />
              </CCol>


              <CCol xs={12} sm={6} lg={2}>
                <CFormLabel htmlFor="category">Order Index ID</CFormLabel>

                <br></br>

                <Select
                  options={orderIndexIds}
                  value={selectedOrderIndexId}
                  onChange={(selectedOption) => setSelectedOrderIndexId(selectedOption)}
                  placeholder="Select Order Index ID"
                  isDisabled={emailType?.value == "customer_invoice" ? true : false}
                  isLoading={checkoutIndexLoading}
                />
              </CCol>


              <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                {
                  userData?.permissions?.includes("email resend") &&
                  <CButton color="dark" className='full-width' onClick={handleEmailResend}>
                    Resend
                    <CIcon icon={cilReload} style={{ marginLeft: 10 }} />
                  </CButton>
                }

              </CCol>

              <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                {
                  userData?.permissions?.includes("download order receipt") &&
                  <CButton color="dark" className='full-width' onClick={handleDownloadReceipt}>
                    Download
                    <CIcon icon={cilCloudDownload} style={{ marginLeft: 10 }} />
                  </CButton>
                }
              </CCol>

            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <RichTextEditor></RichTextEditor> */}




    </CContainer>
  );
};

export default EmailDashboard;
