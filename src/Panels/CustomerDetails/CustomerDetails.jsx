import React, { useState } from 'react';
import './CustomerDetails.css';
import MaterialTable from 'material-table';
import { 
  CButton, 
  CFormSelect, 
  CFormTextarea, 
  CModal, 
  CModalBody, 
  CModalHeader, 
  CModalTitle,
  CModalFooter,
  CTooltip 
} from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CustomerDetails(props) {
  const [visible, setVisible] = useState(false);
  const [contactDetails, setContactDetail] = useState({
    suggestion: "",
    reach_type: ""
  });

  const handleOnSelect = (e) => {
    setContactDetail({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async () => {
    if (contactDetails.suggestion && contactDetails.reach_type) {
      const dataSet = {
        customerID: props?.dataset?.customer_id,
        reach_type: contactDetails?.reach_type,
        content: contactDetails?.suggestion
      };

      try {
        const result = await axios.post("sendMesageToCustomer", dataSet);
        if (result?.status === 200) {
          Swal.fire({
            title: "Message Sent to customer",
            text: "Message Sent",
            icon: "success",
          });
          setContactDetail({ suggestion: "", reach_type: "" });
          setVisible(false);
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to send message",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Please fill out all fields",
        icon: "error",
      });
    }
  };

  const suggestionOptions = [
    { 
      value: '', 
      label: 'Select Option',
    },
    { 
      value: 'For uninterrupted communication, kindly update your email address in your account preferences.', 
      label: 'For uninterrupted communication...',
    },
    { 
      value: 'To receive timely updates, kindly update your mobile number in your account settings.', 
      label: 'To receive timely updates...',
    }
  ];

  const reachOptions = [
    { label: 'Select Option', value: '' },
    { label: "Push Notification", value: "push" },
    { 
      label: "Send Email", 
      value: "email", 
      disabled: props.dataset?.customer_email === "-",
    }
  ];

  const data = {
    columns: [
      { title: 'First Name', field: 'customer_fname', align: 'left' },
      { title: 'Contact Number', field: 'contact_number', align: 'left' },
      { title: 'Email', field: 'customer_email', align: 'left' },
      { title: 'Nationality', field: 'customer_nationality', align: 'left' },
      { title: 'Address', field: 'customer_address', align: 'left' },
      {
        title: '', 
        field: 'action', 
        align: 'left', 
        render: () => (
          <CButton color="success" onClick={() => setVisible(true)}>
            Reach Customer
          </CButton>
        )
      }
    ],
    rows: [
      {
        customer_fname: props.dataset?.customer_fname || 'N/A',
        contact_number: props.dataset?.contact_number || 'N/A',
        customer_email: props.dataset?.customer_email || 'N/A',
        customer_nationality: props.dataset?.customer_nationality || 'N/A',
        customer_address: props.dataset?.customer_address || 'N/A',
      }
    ]
  };

  return (
    <div>
      {/* Simple Modal - This should work */}
      <CModal 
        visible={visible} 
        onClose={() => setVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Reach Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Suggestion</label>
            <CFormSelect
              name="suggestion"
              value={contactDetails.suggestion}
              onChange={handleOnSelect}
            >
              {suggestionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <CFormTextarea
              rows={4}
              value={contactDetails.suggestion}
              onChange={(e) => setContactDetail({...contactDetails, suggestion: e.target.value})}
              placeholder="Type your message here..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Reach Type</label>
            <CFormSelect
              name="reach_type"
              value={contactDetails.reach_type}
              onChange={handleOnSelect}
            >
              {reachOptions.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSendMessage}>
            Send Message
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="confirmation_table mt-3">
        <MaterialTable
          data={data.rows}
          columns={data.columns}
          title="Customer Details"
          options={{
            paging: false,
            search: true,
            toolbar: true,
            headerStyle: {
              backgroundColor: '#D8EFFF',
              fontSize: '16px'
            },
            rowStyle: {
              fontSize: '14px'
            }
          }}
        />
      </div>
    </div>
  );
}

export default CustomerDetails;