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
    CSpinner,
    CImage
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import axios from 'axios';
import moment from 'moment';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilReload } from '@coreui/icons';
import { getAllCustomer, getAllSuppliers, sendGenerateEmail, confirmResendEmail, downloadAllSupplierVouchers, downloadOrderReceipt, downloadSupplierVoucherOneByOne, getAllInternalEmails, getOrderIDs, getOrderIndexIds, resendAllSupplierVouchers } from './services/emailServices';
import RichTextEditor from './RichTextEditor';
import Swal from 'sweetalert2';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

const EmailGeneration = () => {
    const { userData } = useContext(UserLoginContext);
    const [emailType, setEmailType] = useState({})
    const [selectedOrderID, setSelectedOrderID] = useState({})
    const [selectedOrderIndexId, setSelectedOrderIndexId] = useState({})
    const [orderIds, setOrderIds] = useState([])
    const [orderIndexIds, setOrderIndexIDs] = useState([{ value: "All", label: "All Checkouts" }]);
    const [orderIndexIdVals, setOrderIndexIdVals] = useState([])
    const [checkoutIndexLoading, setCheckoutIndexLoading] = useState(false)
    
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
    };

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
        // { value: 'product_wise', label: 'Product Wise' },
        { value: 'general_chat', label: 'General Chat' },
    ];

    // const internalEmails = [
    //     { value: 'supplier.experience@aahaas.com', label: 'supplier.experience@aahaas.com' },
    //     { value: 'products.experience@aahaas.com', label: 'products.experience@aahaas.com' },
    //     { value: 'traveller.experience@aahaas.com', label: 'traveller.experience@aahaas.com' },
    //     { value: 'booking.experience@aahaas.com', label: 'booking.experience@aahaas.com' },
    //     { value: 'finance@aahaas.com', label: 'finance@aahaas.com' },
    // ];
    const [internalEmail, setInternalEmail] = useState({})

    const sendPersonTypes = [
        { value: 'customer', label: 'Customer' },
        { value: 'supplier', label: 'Supplier' },
    ];
    const [sendPersonType, seSendPersonType] = useState({})


    const [suppliers, setSuppliers] = useState([])
    const [selectSupplier, setSelectedSupplier] = useState('')

    const [customers, setCustomers] = useState([])
    const [selectCustomer, setSelectedCustomer] = useState('')
    const [subject, setSubject] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        getOrderIDs().then(response => {

            var dataSet = response.map(res => ({
                value: res?.id,
                label: `AHS_ORD${res.id}`
            }));

            setOrderIds(dataSet)
        })
    }, [])

    const getCustomers = () => {
        try{
    
            getAllCustomer().then(response => {
            // setAllPositions(response);
            const customerData = response.map(customer => ({
                value: customer.id,
                label: customer.username
            }));
            setCustomers(customerData);
            }).catch(error => {
                console.error("Error fetching available employees: ", error);
            });
        
    
        }catch(error){
            console.error("Error available employee: ", error);
        }
    };

    const getSuppliers = () => {
        try{
    
            getAllSuppliers().then(response => {
             const suppliersData = response.map(supplier => ({
                value: supplier.id,
                label: supplier.first_name
                }));
                setSuppliers(suppliersData);
            }).catch(error => {
                console.error("Error fetching available employees: ", error);
            });
        
    
        }catch(error){
            console.error("Error available employee: ", error);
        }
    };

    const [internalEmails, setInternalEmails] = useState([])

    const allInternalEmails = () => {
        try{
    
            getAllInternalEmails().then(response => {
            // setAllPositions(response);
            console.log(response, "Internal Emails")
            const emailData = response.map(email => ({
                value: email.email,
                label: email.email
            }));
            setInternalEmails(emailData);
            }).catch(error => {
                console.error("Error fetching available emails: ", error);
            });
        
    
        }catch(error){
            console.error("Error available emails: ", error);
        }
    };
    
      useEffect (()=>{
        getCustomers();
        getSuppliers();
        allInternalEmails();
      },[])


    const handleEmailResend = () => {
        const missingFields = [];
        if (!subject) missingFields.push("Subject");
        if (!emailType?.value) missingFields.push("Email Type");
        if (!internalEmail?.value) missingFields.push("Internal Email");

        if(emailType?.value === 'order'){
            if (!selectedOrderID?.value) missingFields.push("Order ID");

        }else if(emailType?.value === 'product_wise' || emailType?.value === 'general_chat'){
            if (!sendPersonType?.value) missingFields.push("User Type");
            if (sendPersonType?.value === 'customer' && !selectCustomer) missingFields.push("Customer");
            if (sendPersonType?.value === 'supplier' && !selectSupplier) missingFields.push("Supplier");
        }

        // if (!selectedOrderID?.value && (sendPersonType?.value === null || sendPersonType?.value === undefined)) {
        //     missingFields.push("Order ID");
        // }
        // if (emailType?.value !== 'order' && (sendPersonType?.value === null || sendPersonType?.value === undefined)) {
        //     missingFields.push("User Type");
        // }
        // if (sendPersonType?.value === 'customer'  &&  selectCustomer === '') {
        //     missingFields.push("Customer");
        // }
        // if (sendPersonType?.value === 'supplier' && selectSupplier === '') {
        //     missingFields.push("Supplier");
        // }

        if (missingFields.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: `Please select the fields: ${missingFields.join(', ')}`,
            });
            setLoading(false)
            return;
        }
        console.log(editorState)
        

        // const rawContentState = convertToRaw(editorState.getCurrentContent());
        // const serializedEditorState = JSON.stringify(rawContentState);
        // console.log('Serialized',serializedEditorState)

        const contentState = convertToRaw(editorState.getCurrentContent())
        const htmlContent = draftToHtml(contentState);
        console.log('htmlContent',htmlContent)
        // const body = JSON.stringify(htmlContent); 
        // console.log('Body',body)


        const formData = new FormData();
        formData.append("subject", subject || "");
        formData.append("emailType", emailType?.value || "");
        formData.append("email", internalEmail?.value || "");
        formData.append("orderID", selectedOrderID?.value || "");
        formData.append("personType", sendPersonType?.value || "");
        formData.append("supplier", selectSupplier?.value || "");
        formData.append("customer", selectCustomer?.value || "");
        formData.append("message", htmlContent);
        files.forEach((file,idx) => {
            formData.append(`attachments${idx}`, file);
        });

        formData.append("imageLength",files.length)

        console.log('Send',...formData)

        if(formData){
            try{
                setLoading(true)
                sendGenerateEmail(formData).then(response => {
                    
                    if(response[0] === 200){

                        setLoading(false)
                        Swal.fire({
                            icon: 'success',
                            title: 'Email Sent',
                            text: 'Email has been sent successfully',
                        });

                        setSubject('');
                        setEmailType({});
                        setInternalEmail({});
                        setSelectedOrderID({});
                        seSendPersonType({});
                        setSelectedSupplier('');
                        setSelectedCustomer('');
                        setEditorState(EditorState.createEmpty());
                        setFiles([]);

                    }else{
                        setLoading(false)
                        Swal.fire({
                            icon: 'error',
                            title: 'Email Generation Error',
                            text: 'Error occurred while sending email',
                        });
                    }   

                  }).catch(error => {
                    setLoading(false)
                    console.error("Email Generation Error: ", error);
                  });
              
          
              }catch(error){
                setLoading(false)
                  console.error("Email Generation Error: ", error);
              }
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

    const [files, setFiles] = useState([]);
    const handleChange = (e) => {
        const newFiles = Array.from(e.target.files); 
        const validFiles = newFiles.filter((file) =>
            file.type.startsWith('image/') || file.type === 'application/pdf'
        );

        if (validFiles.length !== newFiles.length) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid File Type',
                text: 'Only images and PDFs are allowed.',
            });
        }

        setFiles((prevFiles) => [...prevFiles, ...validFiles]);  
    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const clearFiles = () => {
        setFiles([]);
    };

     return (
        <CContainer fluid>
             { loading ?  <div className="d-flex justify-content-center"><CSpinner style={{marginTop:"15%"}}/></div> :
            <> <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Email Generation</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="align-items-end">
                        <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="category">Subject</CFormLabel>
                                <br></br>
                                <CFormInput type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                            </CCol>
                            <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="category">Internal Email</CFormLabel>
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


                           
                        </CRow>
                            <br></br> <br></br>
                        

                    </CCardBody>
                </CCard>
            </CCol>

            


            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Additional Attachments</strong>
                      
                    </CCardHeader>
                    <CCardBody>
                    <CRow className="mb-3">
                    <Editor 
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}  />;
                    </CRow>
                   
                        <CRow className="mb-3">
                            <CFormLabel>Add Images or PDFs</CFormLabel>
                          <CCol xs={12} sm={6} lg={8}>
                          <CFormInput
                                type="file"
                                multiple
                                onChange={handleChange}
                                accept="image/*,application/pdf"
                            />
                            </CCol>
                            <CCol xs={12} sm={4} lg={2}>
                            <CButton  color="info" style={{color:"white"}} onClick={clearFiles}>
                            Clear All Files
                        </CButton>
                        
                        </CCol>
                        <CCol xs={12} sm={2} lg={2} className="">
                        {(["generate email"].some(permission => userData?.permissions?.includes(permission))) &&
                         <CButton color="dark" className='full-width' onClick={handleEmailResend}>
                                   Send Email 
                            </CButton>
        }
                        </CCol>


                        </CRow>
                        <CRow>
                            {files.map((file, index) => (
                                <CCol key={index} xs={12} sm={6} lg={3} className="mb-3">
                                    {file.type.startsWith('image/') ? (
                                        <CImage
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            thumbnail
                                            width={100}
                                            height={100}
                                        />
                                    ) : (
                                        <p>{file.name}</p> // Show file name for PDFs
                                    )}
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="mt-2"
                                        style={{color:"white"}}
                                        onClick={() => removeFile(index)}
                                    >
                                        Remove
                                    </CButton>
                                </CCol>
                            ))}
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>

  </>}
        </CContainer>
    );
};

export default EmailGeneration;
