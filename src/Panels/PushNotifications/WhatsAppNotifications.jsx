import React, { useState } from 'react';
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPaperPlane, cilPlus, cilX } from '@coreui/icons';

const WhatsAppNotifications = () => {
  const [message, setMessage] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newNumber, setNewNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ success: null, message: '' });

  const handleAddNumber = () => {
  if (!newNumber.trim()) {
    setStatus({ success: false, message: 'Phone number cannot be empty' });
    return;
  }

  // Validate phone number format
  if (!/^\+?\d+$/.test(newNumber.trim())) {
    setStatus({ success: false, message: 'Invalid phone number format' });
    return;
  }

  if (phoneNumbers.includes(newNumber.trim())) {
    setStatus({ success: false, message: 'Number already added' });
    return;
  }

  setPhoneNumbers([...phoneNumbers, newNumber.trim()]);
  setNewNumber('');
};

  const handleRemoveNumber = (numberToRemove) => {
    setPhoneNumbers(phoneNumbers.filter(num => num !== numberToRemove));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Submit triggered'); // Debug log
  
  if (!message.trim()) {
    setStatus({ success: false, message: 'Message cannot be empty' });
    return;
  }

  if (phoneNumbers.length === 0) {
    setStatus({ success: false, message: 'Please add at least one phone number' });
    return;
  }

  setIsSending(true);
  setStatus({ success: null, message: '' });

  try {
    console.log('Attempting to send:', { phoneNumbers, message }); // Debug log
    
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toNumbers: phoneNumbers,
        otp: message
      }),
    });

    console.log('Response received:', response); // Debug log
    
    const data = await response.json();
    console.log('Response data:', data); // Debug log

    if (response.ok) {
      setStatus({ success: true, message: 'WhatsApp messages sent successfully!' });
      setMessage('');
      setPhoneNumbers([]);
    } else {
      setStatus({ success: false, message: data.message || 'Failed to send messages' });
    }
  } catch (error) {
    console.error('API Error:', error); // Debug log
    setStatus({ success: false, message: 'Network error. Please try again.' });
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
        {status.message && (
          <CAlert color={status.success ? 'success' : 'danger'}>
            {status.message}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="phoneNumbers" className="form-label">Phone Numbers</label>
            <div className="d-flex mb-2">
              <CFormInput
                type="text"
                id="newNumber"
                placeholder="Enter phone number (e.g., +94766832701)"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
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
            
            {phoneNumbers.length > 0 && (
              <CListGroup>
                {phoneNumbers.map((number, index) => (
                  <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                    {number}
                    <CBadge 
                      color="danger" 
                      onClick={() => handleRemoveNumber(number)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CIcon icon={cilX} />
                    </CBadge>
                  </CListGroupItem>
                ))}
              </CListGroup>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <CFormTextarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your WhatsApp message here..."
              required
            />
          </div>

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