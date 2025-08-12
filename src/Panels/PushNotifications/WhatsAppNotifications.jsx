import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormTextarea,
  CFormInput,
  CButton,
  CAlert,
  CSpinner,
  CListGroup,
  CListGroupItem,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPaperPlane, cilPlus, cilX, cilChevronBottom } from '@coreui/icons';
import axios from 'axios';

const WhatsAppNotifications = () => {
  const [message, setMessage] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newNumber, setNewNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  // New state for phone number validation messages
  const [phoneStatus, setPhoneStatus] = useState({ success: null, message: '' });
  // Existing state for overall message sending status
  const [sendStatus, setSendStatus] = useState({ success: null, message: '' });
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('/getcountries');
        const countriesData = response.data.countries || [];

        // Sort countries alphabetically
        const sortedCountries = [...countriesData].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCountries(sortedCountries);

        // Set default country to India if available
        const india = sortedCountries.find(c => c.code === 'IN');
        if (india) {
          setSelectedCountry(india);
        } else if (sortedCountries.length > 0) {
          setSelectedCountry(sortedCountries[0]);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        setSendStatus({
          success: false,
          message: 'Failed to load countries. Using default list.',
        });

        // Default countries if API fails
        setCountries([
          { name: 'India', code: 'IN' },
          { name: 'Sri Lanka', code: 'LK' },
          { name: 'United States', code: 'US' },
        ]);
        setSelectedCountry({ name: 'India', code: 'IN' });
      }
    };

    fetchCountries();
  }, []);

  // Handle adding phone number
  const handleAddNumber = () => {
    // Clear previous status on new attempt
    setPhoneStatus({ success: null, message: '' });
    setSendStatus({ success: null, message: '' });

    if (!newNumber.trim()) {
      setPhoneStatus({ success: false, message: 'Phone number cannot be empty' });
      return;
    }

    // Validate phone number format based on country
    let validationRegex;
    let errorMessage;

    if (selectedCountry) {
      switch (selectedCountry.code) {
        case 'IN': // India
          validationRegex = /^\d{10}$/;
          errorMessage = 'Indian number must be 10 digits';
          break;
        case 'LK': // Sri Lanka
          validationRegex = /^\d{9}$/;
          errorMessage = 'Sri Lankan number must be 9 digits';
          break;
        case 'US': // United States
          validationRegex = /^\d{10}$/;
          errorMessage = 'US number must be 10 digits';
          break;
        default:
          validationRegex = /^\d{8,15}$/;
          errorMessage = 'Invalid phone number format (8-15 digits)';
      }
    } else {
      validationRegex = /^\d{8,15}$/;
      errorMessage = 'Invalid phone number format (8-15 digits)';
    }

    // Check if number matches pattern
    if (!validationRegex.test(newNumber.trim())) {
      setPhoneStatus({
        success: false,
        message: `Invalid phone number for ${selectedCountry?.name || 'selected country'}: ${errorMessage}`,
      });
      return;
    }

    // Format full number with country code
    const countryPrefix = getCountryPrefix(selectedCountry?.code);
    const fullNumber = `${countryPrefix}${newNumber.trim()}`;

    // Check for duplicates
    if (phoneNumbers.includes(fullNumber)) {
      setPhoneStatus({ success: false, message: 'Number already added' });
      return;
    }

    // Add the number
    setPhoneNumbers([...phoneNumbers, fullNumber]);
    setNewNumber('');
    setPhoneStatus({ success: true, message: 'Number added successfully' });
  };

  // Get country prefix based on country code
  const getCountryPrefix = (countryCode) => {
    switch (countryCode) {
      case 'IN':
        return '+91';
      case 'LK':
        return '+94';
      case 'US':
      case 'CA':
        return '+1';
      case 'GB':
        return '+44';
      case 'AU':
        return '+61';
      case 'DE':
        return '+49';
      case 'FR':
        return '+33';
      case 'IT':
        return '+39';
      case 'JP':
        return '+81';
      case 'RU':
        return '+7';
      case 'ZA':
        return '+27';
      case 'AE':
        return '+971';
      case 'SG':
        return '+65';
      case 'MY':
        return '+60';
      case 'TH':
        return '+66';
      case 'ID':
        return '+62';
      case 'PH':
        return '+63';
      case 'VN':
        return '+84';
      case 'NZ':
        return '+64';
      case 'QA':
        return '+974';
      case 'SA':
        return '+966';
      case 'TW':
        return '+886';
      case 'NL':
        return '+31';
      case 'CH':
        return '+41';
      case 'ES':
        return '+34';
      case 'CZ':
        return '+420';
      case 'AUT':
        return '+43';
      case 'HU':
        return '+36';
      case 'NO':
        return '+47';
      case 'FI':
        return '+358';
      case 'DK':
        return '+45';
      case 'SE':
        return '+46';
      case 'PL':
        return '+48';
      case 'NP':
        return '+977';
      case 'VEN':
        return '+58';
      case 'UY':
        return '+598';
      case 'PE':
        return '+51';
      case 'PY':
        return '+595';
      case 'PA':
        return '+507';
      case 'NI':
        return '+505';
      case 'MX':
        return '+52';
      case 'HN':
        return '+504';
      case 'GU':
        return '+1-671';
      case 'SV':
        return '+503';
      case 'EC':
        return '+593';
      case 'DO':
        return '+1-809';
      case 'CU':
        return '+53';
      case 'CR':
        return '+506';
      case 'CO':
        return '+57';
      case 'CL':
        return '+56';
      case 'BR':
        return '+55';
      case 'BO':
        return '+591';
      case 'BZ':
        return '+501';
      case 'AR':
        return '+54';
      case 'KR':
        return '+82';
      case 'AQ':
        return '+672';
      case 'KE':
        return '+254';
      case 'MV':
        return '+960';
      case 'MU':
        return '+230';
      case 'AZ':
        return '+994';
      case 'GE':
        return '+995';
      case 'SC':
        return '+248';
      case 'TR':
        return '+90';
      case 'KH':
        return '+855';
      default:
        return '+';
    }
  };

  // Handle key press in phone number input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNumber();
    }
  };

  // Handle removing a number
  const handleRemoveNumber = (numberToRemove) => {
    setPhoneNumbers(phoneNumbers.filter((num) => num !== numberToRemove));
    setPhoneStatus({ success: null, message: '' }); // Clear status on remove
    setSendStatus({ success: null, message: '' });
  };

  // Handle sending messages
  const handleSubmit = async (e) => {
    e.preventDefault();

    setPhoneStatus({ success: null, message: '' }); // Clear phone status on submit
    setSendStatus({ success: null, message: '' });

    if (!message.trim()) {
      // You could add a message-specific error state here if needed
      setSendStatus({ success: false, message: 'Message cannot be empty' });
      return;
    }

    if (phoneNumbers.length === 0) {
      setSendStatus({ success: false, message: 'Please add at least one phone number' });
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post('/send-whatsapp', {
        toNumbers: phoneNumbers,
        otp: message,
      });

      setSendStatus({
        success: true,
        message: 'WhatsApp messages sent successfully!',
      });

      setMessage('');
      setPhoneNumbers([]);
    } catch (error) {
      let errorMessage = 'Network error. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || error.response.statusText;
      } else if (error.request) {
        errorMessage = 'No response from server';
      }

      setSendStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>Send WhatsApp Notifications</h5>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="phoneNumbers" className="form-label">
              Phone Numbers
            </label>

            <div className="d-flex mb-2 align-items-center">
              <CDropdown
                variant="input-group"
                show={showDropdown}
                setShow={setShowDropdown}
                className="me-2"
              >
                <CDropdownToggle
                  color="secondary"
                  variant="outline"
                  className="d-flex align-items-center"
                >
                  {selectedCountry ? (
                    <>
                      <span className="me-1">{getCountryPrefix(selectedCountry.code)}</span>
                      <CIcon icon={cilChevronBottom} />
                    </>
                  ) : (
                    'Select'
                  )}
                </CDropdownToggle>
                <CDropdownMenu
                  style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    minWidth: '200px',
                    width: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                  }}
                  onScroll={(e) => e.stopPropagation()}
                >
                  {countries.map((country) => (
                    <CDropdownItem
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowDropdown(false);
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{country.name}</span>
                      <span>{getCountryPrefix(country.code)}</span>
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>

              <CFormInput
                type="tel"
                id="newNumber"
                placeholder={`Enter phone number (e.g., ${selectedCountry?.code === 'IN' ? '9876543210' : '771234567'})`}
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow-1"
              />

              <CButton
                color="primary"
                variant="outline"
                onClick={handleAddNumber}
                className="ms-2"
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </div>
            {/* Phone number validation message is now here */}
            {phoneStatus.message && (
              <CAlert color={phoneStatus.success ? 'success' : 'danger'} className="mt-2 p-2">
                {phoneStatus.message}
              </CAlert>
            )}

            {/* Added Phone Numbers */}
            {phoneNumbers.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {phoneNumbers.map((number, index) => (
                  <CBadge
                    key={index}
                    color="primary"
                    className="d-flex align-items-center py-2"
                  >
                    {number}
                    <CIcon
                      icon={cilX}
                      className="ms-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveNumber(number)}
                    />
                  </CBadge>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <CFormTextarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your WhatsApp message here..."
              required
            />
          </div>
          {/* Overall send status message is now here */}
          {sendStatus.message && (
            <CAlert color={sendStatus.success ? 'success' : 'danger'} className="mt-2 p-2">
              {sendStatus.message}
            </CAlert>
          )}

          <CButton
            type="submit"
            color="primary"
            disabled={isSending || phoneNumbers.length === 0 || !message.trim()}
          >
            {isSending ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" className="me-2" />
                Sending...
              </>
            ) : (
              <>
                <CIcon icon={cilPaperPlane} className="me-2" />
                Send Messages
              </>
            )}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default WhatsAppNotifications;