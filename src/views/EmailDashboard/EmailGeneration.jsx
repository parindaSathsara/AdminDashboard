import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CFormLabel,
    CButton,
    CRow,
    CFormInput,
    CImage
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
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';

const EmailGeneration = () => {
    const { userData } = useContext(UserLoginContext);
    const [emailType, setEmailType] = useState({})
    const [selectedOrderID, setSelectedOrderID] = useState({})
    const [selectedOrderIndexId, setSelectedOrderIndexId] = useState({})
    const [orderIds, setOrderIds] = useState([])
    const [orderIndexIds, setOrderIndexIDs] = useState([{ value: "All", label: "All Checkouts" }]);
    const [orderIndexIdVals, setOrderIndexIdVals] = useState([])
    const [checkoutIndexLoading, setCheckoutIndexLoading] = useState(false)
    
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const handleONCheckoutIDClick = (selectedOption) => {
        setSelectedOrderID(selectedOption);

        setSelectedOrderIndexId({});

        setCheckoutIndexLoading(true);
        getOrderIndexIds(selectedOption?.value).then(response => {

            // console.log(response);

            setOrderIndexIdVals(response)

            var dataSet = response.map(res => ({
                value: res,
                label: `VO_${res}`
            }));


            dataSet.unshift({ value: "All", label: "All Checkouts" });

            setCheckoutIndexLoading(false);
            setOrderIndexIDs(dataSet);

        });
    }

    const emailTypes = [
        { value: 'order', label: 'Order' },
        { value: 'product_wise', label: 'Product Wise' },
        { value: 'general_chat', label: 'General Chat' },
    ];

    const internalEmails = [
        { value: 'product@aahaas.com', label: 'product@aahaas.com' },
    ];
    const [internalEmail, setInternalEmail] = useState({})

    const sendPersonTypes = [
        { value: 'customer', label: 'Customer' },
        { value: 'supplier', label: 'Supplier' },
    ];
    const [sendPersonType, seSendPersonType] = useState({})


    const suppliers = [
        { value: 'fernando', label: 'fernando' },
        { value: 'fernando', label: 'fernando' },
    ];
    const [selectSupplier, setSelectedSupplier] = useState('')

    const customers = [
        { value: 'perera', label: 'perera' },
        { value: 'perera', label: 'perera' },
    ];
    const [selectCustomer, setSelectedCustomer] = useState('')


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
        console.log(editorState)
        // if (!emailType?.value) missingFields.push("Email Type");
        // if (!selectedOrderID?.value) missingFields.push("Order ID");

        // if (missingFields.length > 0) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Missing Fields',
        //         text: `Please select the following fields: ${missingFields.join(', ')}`,
        //     });
        //     return;
        // }



        // if (emailType.value === "customer_invoice") {
        //     confirmResendEmail(selectedOrderID.value);
        // } else {
        //     resendAllSupplierVouchers(selectedOrderID?.value, selectedOrderIndexId?.value)
        // }
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

    const [file, setFile] = useState();
    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const change = ()=>{
        setFile(null)
    }

     return (
        <CContainer fluid>

            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Email Generation</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="align-items-end">

                            <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="category">Internal Emial</CFormLabel>
                                <br></br>
                                <Select
                                    options={internalEmails}
                                    value={internalEmail}
                                    onChange={(selectedOption) => {
                                        setInternalEmail(selectedOption)
                                    }}
                                    placeholder="Select a Internal Email"
                                />
                            </CCol>
                            <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="category">Email Type</CFormLabel>
                                <br></br>
                                <Select
                                    options={emailTypes}
                                    value={emailType}
                                    onChange={(selectedOption) => {
                                        setEmailType(selectedOption)
                                        setSelectedSupplier('')
                                        setSelectedCustomer('')
                                    }}
                                    placeholder="Select a Email Type"
                                />
                            </CCol>
                            {
                                emailType?.value == "order" ? 
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
                            </CCol> : null
                            }
                            {
                                emailType?.value == "product_wise" || emailType?.value == "general_chat" ? 
                               
                                <>
                                 <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="category">User Type</CFormLabel>

                                <br></br>

                                <Select
                                    options={sendPersonTypes}
                                    value={sendPersonType}
                                    onChange={(selectedOption) => seSendPersonType(selectedOption)}
                                    placeholder="Select user type"
                                    isSearchable
                                />
                                
                            </CCol>
                                {
                                     sendPersonType?.value == "customer"? 
                                     <CCol xs={12} sm={6} lg={3}>
                                     <CFormLabel htmlFor="category">Customer Name</CFormLabel>
       
                                     <br></br>
       
                                     <Select
                                         options={customers}
                                         value={selectCustomer}
                                         onChange={(selectedOption) => (setSelectedCustomer(selectedOption))}
                                         placeholder="Select user type"
                                         isSearchable
                                     />
                                 </CCol> : null
                                }

                                {
                                sendPersonType?.value == "supplier" && emailType !== 'order' ? 
                                <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="category">Supplier Name</CFormLabel>

                                <br></br>

                                <Select
                                    options={suppliers}
                                    value={selectSupplier}
                                    onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                                    placeholder="Select Supplier"
                                    isSearchable
                                />
                            </CCol> : null
                            }
                             
                                </>
                            : null
                             }


                            <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                   
                                <CButton color="dark" className='full-width' onClick={handleEmailResend}>
                                    Send
                                </CButton>

                            </CCol>
                        </CRow>
                            <br></br> <br></br>
                        <Editor 
                        editorState={editorState}
                        onEditorStateChange={setEditorState}  />;

                    </CCardBody>
                </CCard>
            </CCol>

            

            {/* <RichTextEditor></RichTextEditor> */}

            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Additional Attachment</strong>
                        <CButton style={{color:"white", }} color='info' onClick={change} >Clear</CButton>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="align-items-end">
                             <CFormInput onChange={handleChange} type="file" placeholder="Add Image" aria-label="" />
                             {/* <CImage rounded thumbnail src={file} width={20} height={20} /> */}
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>


        </CContainer>
    );
};

export default EmailGeneration;
