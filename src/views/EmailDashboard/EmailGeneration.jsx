import React, { useCallback, useContext, useEffect, useState, useRef, useMemo } from 'react';
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
  CImage,
  CBadge
} from '@coreui/react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, Modifier, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import { FaEraser } from 'react-icons/fa';
import { getAllCustomer, getAllSuppliers, sendGenerateEmail, getAllInternalEmails, getOrderIDs, getOrderIndexIds } from './services/emailServices';

// Custom debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Optimized API calls with caching (for non-searchable data)
const useCachedApiCall = (apiFunction, transformData, defaultData = []) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const cache = useRef(new Map());

  useEffect(() => {
    const fetchData = async () => {
      if (cache.current.has(apiFunction.name)) {
        setData(cache.current.get(apiFunction.name));
        return;
      }

      setLoading(true);
      try {
        const response = await apiFunction();
        const transformed = transformData(response);
        cache.current.set(apiFunction.name, transformed);
        setData(transformed);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunction, transformData, defaultData]);

  return { data, loading };
};

// New hook for fetching customers with search and pagination
const useFetchCustomers = (searchQuery) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchQuery === null) return;
      setLoading(true);
      try {
        const response = await getAllCustomer(1, 20, debouncedSearchQuery);
        if (response) {
          const transformedData = response.data.map(customer => ({
            value: customer.id,
            label: customer.username,
          }));
          setData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchQuery]);

  return { data, loading };
};

const EmailGeneration = () => {
  const fileInputRef = useRef(null);
  const { userData } = useContext(UserLoginContext);
  
  // State declarations
  const [emailType, setEmailType] = useState({});
  const [selectedOrderID, setSelectedOrderID] = useState({});
  const [selectedOrderIndexId, setSelectedOrderIndexId] = useState({});
  const [orderIndexIdVals, setOrderIndexIdVals] = useState([]);
  const [orderIndexIDs, setOrderIndexIDs] = useState([]);
  const [checkoutIndexLoading, setCheckoutIndexLoading] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [internalEmail, setInternalEmail] = useState({});
  const [sendPersonType, setSendPersonType] = useState({});
  const [selectSupplier, setSelectedSupplier] = useState('');
  const [selectCustomer, setSelectedCustomer] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  
  const debouncedSubject = useDebounce(subject, 300);
  
  // Email types
  const emailTypes = useMemo(() => [
    { value: 'order', label: 'Order' },
    { value: 'general_chat', label: 'General Chat' },
  ], []);
  
  // Send person types
  const sendPersonTypes = useMemo(() => [
    { value: 'customer', label: 'Customer' },
    { value: 'supplier', label: 'Supplier' },
  ], []);
  
  // Transform functions for API data
  const transformSuppliers = useCallback((response) => {
    return response ? response.map(supplier => ({
      value: supplier.id,
      label: supplier.first_name
    })) : [];
  }, []);
  
  const transformInternalEmails = useCallback((response) => {
    return response ? response.map(email => ({
      value: email.email,
      label: email.email
    })) : [];
  }, []);
  
  const transformOrderIds = useCallback((response) => {
    return response ? response.map(res => ({
      value: res?.id,
      label: `AHS_ORD${res.id}`
    })) : [];
  }, []);
  
  // Use cached API calls for non-searchable data
  const { data: suppliers, loading: suppliersLoading } = useCachedApiCall(
    getAllSuppliers,  
    transformSuppliers,  
    []
  );
  
  const { data: internalEmails, loading: emailsLoading } = useCachedApiCall(
    getAllInternalEmails,  
    transformInternalEmails,  
    []
  );
  
  const { data: orderIds, loading: ordersLoading } = useCachedApiCall(
    getOrderIDs,  
    transformOrderIds,  
    []
  );

  // Use the new hook for customers with search
  const { data: customers, loading: customersLoading } = useFetchCustomers(customerSearch);
  
  // Editor change handler
  const handleEditorChange = useCallback((state) => {
    setEditorState(state);
  }, []);
  
  // Remove selected text from editor
  const removeSelectedText = useCallback(() => {
    const selection = editorState.getSelection();
    
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const newContentState = Modifier.removeRange(
        contentState,
        selection,
        'backward'
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      setEditorState(newEditorState);
    }
  }, [editorState]);
  
  // Handle order ID selection
  const handleOrderIDClick = useCallback(async (selectedOption) => {
    setSelectedOrderID(selectedOption);
    setSelectedOrderIndexId({});
    
    setCheckoutIndexLoading(true);
    try {
      const response = await getOrderIndexIds(selectedOption?.value);
      setOrderIndexIdVals(response);
      
      const dataSet = response.map(res => ({
        value: res,
        label: `VO_${res}`
      }));
      
      dataSet.unshift({ value: "All", label: "All Checkouts" });
      setOrderIndexIDs(dataSet);
    } catch (error) {
      console.error("Error fetching order index IDs:", error);
    } finally {
      setCheckoutIndexLoading(false);
    }
  }, []);
  
  // Handle file changes
  const handleChange = useCallback((e) => {
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
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, []);
  
  // Remove file
  const removeFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);
  
  // Clear files
  const clearFiles = useCallback(() => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);
  
  // Handle email resend
  const handleEmailResend = useCallback(async () => {
    const missingFields = [];
    if (!subject) missingFields.push("Subject");
    if (!emailType?.value) missingFields.push("Email Type");
    if (!internalEmail?.value) missingFields.push("Internal Email");
    
    if (emailType?.value === 'order') {
      if (!selectedOrderID?.value) missingFields.push("Order ID");
    } else if (emailType?.value === 'product_wise' || emailType?.value === 'general_chat') {
      if (!sendPersonType?.value) missingFields.push("User Type");
      if (sendPersonType?.value === 'customer' && !selectCustomer) missingFields.push("Customer");
      if (sendPersonType?.value === 'supplier' && !selectSupplier) missingFields.push("Supplier");
    }
    
    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: `Please select the fields: ${missingFields.join(', ')}`,
      });
      return;
    }
    
    const contentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(contentState);
    
    const formData = new FormData();
    formData.append("subject", subject || "");
    formData.append("emailType", emailType?.value || "");
    formData.append("email", internalEmail?.value || "");
    formData.append("orderID", selectedOrderID?.value || "");
    formData.append("personType", sendPersonType?.value || "");
    formData.append("supplier", selectSupplier?.value || "");
    formData.append("customer", selectCustomer?.value || "");
    formData.append("message", htmlContent);
    
    files.forEach((file, idx) => {
      formData.append(`attachments${idx}`, file);
    });
    
    formData.append("imageLength", files.length);
    
    try {
      setLoading(true);
      const response = await sendGenerateEmail(formData);
      
      if (response[0] === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent',
          text: 'Email has been sent successfully',
        });
        
        // Reset form
        setSubject('');
        setEmailType({});
        setInternalEmail({});
        setSelectedOrderID({});
        setSendPersonType({});
        setSelectedSupplier('');
        setSelectedCustomer('');
        setEditorState(EditorState.createEmpty());
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Email Generation Error',
          text: 'Error occurred while sending email',
        });
      }
    } catch (error) {
      console.error("Email Generation Error: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Email Generation Error',
        text: 'Error occurred while sending email',
      });
    } finally {
      setLoading(false);
    }
  }, [subject, emailType, internalEmail, selectedOrderID, sendPersonType, selectSupplier, selectCustomer, editorState, files]);
  
  // CSS for the editor
  const editorStyles = useMemo(() => `
    .rdw-colorpicker-dropdown {
      width: 180px !important;
      overflow-x: hidden !important;
    }
    
    .rdw-colorpicker-modal span {
      white-space: nowrap !important;
    }
    
    .rdw-image-modal,
    .rdw-embedded-modal,
    .rdw-link-modal {
      position: absolute !important;
      top: 40% !important;
      left: 40% !important;
      transform: translateX(-50%) !important;
      z-index: 1000 !important;
      max-width: 90vw !important;
      min-width: 300px;
      min-height: 300px;
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      word-break: break-word;
      white-space: normal;
      overflow: hidden !important;
      box-sizing: border-box;
    }
    
    .rdw-image-modal input,
    .rdw-embedded-modal input,
    .rdw-link-modal input {
      max-width: 100%;
      width: 100%;
      box-sizing: border-box;
    }
    
    .rdw-image-modal,
    .rdw-embedded-modal,
    .rdw-link-modal {
      scrollbar-width: none;
    }
    
    .rdw-image-modal::-webkit-scrollbar,
    .rdw-embedded-modal::-webkit-scrollbar,
    .rdw-link-modal::-webkit-scrollbar {
      display: none;
    }
  `, []);
  
  // Show loading if any API is still loading
  const isDataLoading = suppliersLoading || emailsLoading || ordersLoading;
  
  if (isDataLoading) {
    return (
      <CContainer fluid>
        <div className="d-flex justify-content-center">
          <CSpinner style={{ marginTop: "15%" }} />
        </div>
      </CContainer>
    );
  }
  
  return (
    <CContainer fluid>
      <style>{editorStyles}</style>
      
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Email Generation</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="align-items-end">
              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="subject">Subject</CFormLabel>
                <br />
                <CFormInput 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="Enter email subject"
                />
              </CCol>
              
              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="internal-email">Internal Email</CFormLabel>
                <br />
                <Select
                  options={internalEmails}
                  value={internalEmail}
                  onChange={(selectedOption) => setInternalEmail(selectedOption)}
                  placeholder="Select Internal Email"
                  isLoading={emailsLoading}
                />
              </CCol>
              
              <CCol xs={12} sm={6} lg={3}>
                <CFormLabel htmlFor="email-type">Email Type</CFormLabel>
                <br />
                <Select
                  options={emailTypes}
                  value={emailType}
                  onChange={(selectedOption) => {
                    setEmailType(selectedOption);
                    setSelectedSupplier('');
                    setSelectedCustomer('');
                  }}
                  placeholder="Select Email Type"
                />
              </CCol>
              
              {emailType?.value === "order" && (
                <CCol xs={12} sm={6} lg={3}>
                  <CFormLabel htmlFor="order-id">Order ID</CFormLabel>
                  <br />
                  <Select
                    options={orderIds}
                    value={selectedOrderID}
                    onChange={handleOrderIDClick}
                    placeholder="Select Order ID"
                    isSearchable
                    menuShouldScrollIntoView
                    menuShouldBlockScroll
                    maxMenuHeight={150}
                    isLoading={ordersLoading || checkoutIndexLoading}
                  />
                </CCol>
              )}
              
              {(emailType?.value === "product_wise" || emailType?.value === "general_chat") && (
                <>
                  <CCol xs={12} sm={6} lg={3}>
                    <CFormLabel htmlFor="user-type">User Type</CFormLabel>
                    <br />
                    <Select
                      options={sendPersonTypes}
                      value={sendPersonType}
                      onChange={setSendPersonType}
                      placeholder="Select User Type"
                      isSearchable
                    />
                  </CCol>
                  
                  {sendPersonType?.value === "customer" && (
                    <CCol xs={12} sm={6} lg={3}>
                      <CFormLabel htmlFor="customer">Customer Name</CFormLabel>
                      <br />
                      <Select
                        options={customers}
                        value={selectCustomer}
                        onChange={setSelectedCustomer}
                        onInputChange={(inputValue) => setCustomerSearch(inputValue)}
                        placeholder="Type to search for a customer"
                        isSearchable
                        menuShouldScrollIntoView
                        menuShouldBlockScroll
                        maxMenuHeight={150}
                        isLoading={customersLoading}
                        noOptionsMessage={() => "No customers found."}
                      />
                    </CCol>
                  )}
                  
                  {sendPersonType?.value === "supplier" && emailType.value !== 'order' && (
                    <CCol xs={12} sm={6} lg={3}>
                      <CFormLabel htmlFor="supplier">Supplier Name</CFormLabel>
                      <br />
                      <Select
                        options={suppliers}
                        value={selectSupplier}
                        onChange={setSelectedSupplier}
                        placeholder="Select Supplier"
                        isSearchable
                        menuShouldScrollIntoView
                        menuShouldBlockScroll
                        maxMenuHeight={150}
                        isLoading={suppliersLoading}
                      />
                    </CCol>
                  )}
                </>
              )}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Additional Attachments</strong>
            {files.length > 0 && (
              <CBadge color="info" shape="rounded-pill">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </CBadge>
            )}
          </CCardHeader>
          <CCardBody style={{ marginRight: "20px" }}>
            <CRow className="mb-3">
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={{
                  options: [
                    'inline',
                    'blockType',
                    'fontSize',
                    'fontFamily',
                    'list',
                    'textAlign',
                    'colorPicker',
                    'link',
                    'embedded',
                    'emoji',
                    'image',
                    'history'
                  ]
                }}
                toolbarCustomButtons={[
                  <button
                    key="custom-remove"
                    onClick={removeSelectedText}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      margin: '0 10px',
                      fontSize: '18px'
                    }}
                    title="Clear Selected Text"
                  >
                    <FaEraser />
                  </button>
                ]}
              />
            </CRow>
            
            <CRow className="mb-3 align-items-center">
              <CCol xs={12} sm={6} lg={8}>
                <CFormLabel>Add Images or PDFs</CFormLabel>
                
                {/* Custom file input display */}
                <div className="position-relative">
                  <CFormInput
                    type="file"
                    multiple
                    onChange={handleChange}
                    accept="image/*,application/pdf"
                    ref={fileInputRef}
                    className="position-absolute"
                    style={{ opacity: 0, zIndex: 2, cursor: 'pointer', height: '38px' }}
                  />
                  <div 
                    className="border rounded p-2 d-flex align-items-center"
                    style={{ 
                      backgroundColor: '#f8f9fa', 
                      minHeight: '38px',
                      cursor: 'pointer'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="text-muted">
                      {files.length > 0 
                        ? files.map(file => file.name).join(', ') 
                        : 'Choose files...'
                      }
                    </span>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </small>
                  </div>
                )}
              </CCol>
              
              <CCol xs={12} sm={4} lg={2} className="mt-3 mt-sm-0">
                <CButton 
                  color="info" 
                  style={{ color: "white" }} 
                  onClick={clearFiles}
                  disabled={files.length === 0}
                >
                  Clear All Files
                </CButton>
              </CCol>
              
              <CCol xs={12} sm={2} lg={2} className="mt-3 mt-sm-0">
                {userData?.permissions?.includes("generate email") && (
                  <CButton 
                    color="dark" 
                    className='full-width' 
                    onClick={handleEmailResend}
                    disabled={loading}
                  >
                    {loading ? <CSpinner size="sm" /> : 'Send Email'}
                  </CButton>
                )}
              </CCol>
            </CRow>
            
            <CRow>
              {/* Show file previews */}
              {files.map((file, index) => (
                <CCol key={index} xs={12} sm={6} lg={4} className="mb-3">
                  <div className="d-flex align-items-center p-2 border rounded">
                    {file.type.startsWith('image/') ? (
                      <CImage
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        thumbnail
                        width={50}
                        height={50}
                        className="me-2"
                      />
                    ) : (
                      <div className="bg-light p-2 me-2">
                        <i className="cil-file"></i>
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <div className="text-truncate" style={{ maxWidth: '150px' }} title={file.name}>
                        {file.name}
                      </div>
                      <small className="text-muted">
                        {(file.size / 1024).toFixed(1)} KB
                      </small>
                    </div>
                    <CButton
                      color="danger"
                      size="sm"
                      className="ms-2"
                      style={{ color: "white" }}
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </CButton>
                  </div>
                </CCol>
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CContainer>
  );
};

export default EmailGeneration;