import React, { useState } from 'react';
import './CustomerDetails.css';
import MaterialTable from 'material-table';
import { 
  CButton, 
  CFormTextarea, 
  CModal, 
  CModalBody, 
  CModalHeader, 
  CModalTitle,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CustomerDetails(props) {
  const [visible, setVisible] = useState(false);
  const [contactDetails, setContactDetail] = useState({
    suggestion: "",
    reach_type: ""
  });
  const [suggestionDropdownOpen, setSuggestionDropdownOpen] = useState(false);
  const [reachTypeDropdownOpen, setReachTypeDropdownOpen] = useState(false);

  const handleSuggestionSelect = (value, label) => {
    setContactDetail({ ...contactDetails, suggestion: value });
    setSuggestionDropdownOpen(false);
  };

  const handleReachTypeSelect = (value) => {
    setContactDetail({ ...contactDetails, reach_type: value });
    setReachTypeDropdownOpen(false);
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
      label: 'For uninterrupted communication, kindly update your email address in your account preferences.',
    },
    { 
      value: 'To receive timely updates, kindly update your mobile number in your account settings.', 
      label: 'To receive timely updates, kindly update your mobile number in your account settings.',
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

  // Get display label for selected values
  const getSelectedSuggestionLabel = () => {
    const selected = suggestionOptions.find(opt => opt.value === contactDetails.suggestion);
    return selected ? selected.label : 'Select Option';
  };

  const getSelectedReachTypeLabel = () => {
    const selected = reachOptions.find(opt => opt.value === contactDetails.reach_type);
    return selected ? selected.label : 'Select Option';
  };

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
      <CModal 
        visible={visible} 
        onClose={() => setVisible(false)}
        size="lg"
        className="custom-dropdown-modal reach-customer-modal"
      >
        <CModalHeader>
          <CModalTitle>Reach Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Suggestion Dropdown */}
          <div className="mb-3">
            <label className="form-label">Suggestion</label>
            <CDropdown
              show={suggestionDropdownOpen}
              onToggle={(show) => setSuggestionDropdownOpen(show)}
              className="w-100"
            >
              <CDropdownToggle 
                color="outline-secondary" 
                className="w-100 text-start dropdown-toggle-custom"
                style={{ 
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span className="dropdown-text">{getSelectedSuggestionLabel()}</span>
              </CDropdownToggle>
              <CDropdownMenu className="w-100 dropdown-menu-custom">
                {suggestionOptions.map((option) => (
                  <CDropdownItem 
                    key={option.value} 
                    onClick={() => handleSuggestionSelect(option.value, option.label)}
                    active={contactDetails.suggestion === option.value}
                    className="dropdown-item-custom"
                  >
                    {option.label}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <CFormTextarea
              rows={4}
              value={contactDetails.suggestion}
              onChange={(e) => setContactDetail({...contactDetails, suggestion: e.target.value})}
              placeholder="Type your message here..."
              className="message-textarea"
            />
          </div>

          {/* Reach Type Dropdown */}
          <div className="mb-3">
            <label className="form-label">Reach Type</label>
            <CDropdown
              show={reachTypeDropdownOpen}
              onToggle={(show) => setReachTypeDropdownOpen(show)}
              className="w-100"
            >
              <CDropdownToggle 
                color="outline-secondary" 
                className="w-100 text-start dropdown-toggle-custom"
                style={{ 
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span className="dropdown-text">{getSelectedReachTypeLabel()}</span>
              </CDropdownToggle>
              <CDropdownMenu className="w-100 dropdown-menu-custom">
                {reachOptions.map((option) => (
                  <CDropdownItem 
                    key={option.value} 
                    onClick={() => !option.disabled && handleReachTypeSelect(option.value)}
                    active={contactDetails.reach_type === option.value}
                    disabled={option.disabled}
                    className={`dropdown-item-custom ${option.disabled ? 'disabled-item' : ''}`}
                  >
                    {option.label}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
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