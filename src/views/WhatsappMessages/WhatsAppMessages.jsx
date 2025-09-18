import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
  CFormInput,
  CFormSelect,
  CButton,
  CPagination,
  CPaginationItem,
  CBadge,
  CFormFeedback
} from '@coreui/react';
import { cilFilter, cilReload, cilWarning } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const WhatsAppMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [filters, setFilters] = useState({
    date_after: '',
    date_before: '',
    limit: 100
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 100,
    totalItems: 0,
  });

  // Validate dates
  const validateDates = () => {
    setValidationError('');
    
    if (filters.date_after && filters.date_before) {
      const startDate = new Date(filters.date_after);
      const endDate = new Date(filters.date_before);
      
      if (endDate <= startDate) {
        setValidationError('End date must be after start date');
        return false;
      }
    }
    
    return true;
  };

  // Fetch messages from API
  const fetchMessages = async (page = 1) => {
    // Validate dates before making API call
    if (!validateDates()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setValidationError('');
    
    try {
      const requestData = { ...filters, page };
      const response = await axios.post('/getInboundMessages', requestData);
      
      if (response.data && response.data.success) {
        setMessages(response.data.messages || []);
        setPagination(prev => ({ 
          ...prev, 
          totalItems: response.data.count || 0, 
          currentPage: page, 
          perPage: filters.limit, 
        }));
      } else {
        setError(response.data?.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Full error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    fetchMessages(1);
  }, []);

  // Handle filter changes with validation
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear validation error when user changes dates
    if ((key === 'date_after' || key === 'date_before') && validationError) {
      setValidationError('');
    }
  };

  // Apply filters with validation
  const applyFilters = () => {
    if (validateDates()) {
      fetchMessages(1);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      date_after: '',
      date_before: '',
      limit: 100
    });
    setValidationError('');
    fetchMessages(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.replace('whatsapp:', '');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'success';
      case 'delivered': return 'info';
      case 'sent': return 'primary';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  // Check if dates are invalid
  const isDateRangeInvalid = () => {
    if (filters.date_after && filters.date_before) {
      const startDate = new Date(filters.date_after);
      const endDate = new Date(filters.date_before);
      return endDate <= startDate;
    }
    return false;
  };

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">WhatsApp Inbound Messages</h5>
            <div className="text-muted small">View all incoming WhatsApp messages</div>
          </CCardHeader>
          <CCardBody>
            {/* Filters */}
            <div className="row mb-4 g-3">
              <div className="col-md-3">
                <CFormInput
                  type="date"
                  label="Start Date"
                  value={filters.date_after}
                  onChange={(e) => handleFilterChange('date_after', e.target.value)}
                  invalid={isDateRangeInvalid()}
                />
                <CFormFeedback invalid>Start date must be before end date</CFormFeedback>
              </div>
              <div className="col-md-3">
                <CFormInput
                  type="date"
                  label="End Date"
                  value={filters.date_before}
                  onChange={(e) => handleFilterChange('date_before', e.target.value)}
                  invalid={isDateRangeInvalid()}
                />
                <CFormFeedback invalid>End date must be after start date</CFormFeedback>
              </div>
              <div className="col-md-2">
                <CFormSelect
                  label="Limit"
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                >
                  <option value={50}>50 messages</option>
                  <option value={100}>100 messages</option>
                  <option value={200}>200 messages</option>
                  <option value={500}>500 messages</option>
                  <option value={1000}>1000 messages</option>
                </CFormSelect>
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <CButton 
                  color="primary" 
                  className="me-2" 
                  onClick={applyFilters}
                  disabled={isDateRangeInvalid()}
                >
                  <CIcon icon={cilFilter} className="me-1" />
                  Apply Filters
                </CButton>
                <CButton color="secondary" onClick={resetFilters}>
                  <CIcon icon={cilReload} className="me-1" />
                  Reset
                </CButton>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <CAlert color="warning" className="mb-4">
                <CIcon icon={cilWarning} className="me-2" />
                {validationError}
              </CAlert>
            )}

            {/* API Error Alert */}
            {error && (
              <CAlert color="danger" className="mb-4">
                {error}
              </CAlert>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <div className="mt-2">Loading messages...</div>
              </div>
            )}

            {/* Messages Table */}
            {!loading && Array.isArray(messages) && messages.length > 0 && (
              <>
                <div className="table-responsive">
                  <CTable hover striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>From</CTableHeaderCell>
                        <CTableHeaderCell>Message</CTableHeaderCell>
                        <CTableHeaderCell>Date Sent</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Media</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {messages.map((message) => (
                        <CTableRow key={message.sid || Math.random()}>
                          <CTableDataCell>
                            <div className="fw-semibold">{formatPhoneNumber(message.from)}</div>
                            <small className="text-muted">To: {formatPhoneNumber(message.to)}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="message-body">
                              {message.body || 'No message content'}
                            </div>
                            <small className="text-muted">SID: {message.sid}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDate(message.date_sent)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getStatusColor(message.status)}>
                              {message.status || 'unknown'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {parseInt(message.media_count || 0) > 0 ? (
                              <CBadge color="info">
                                {message.media_count} media files
                              </CBadge>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>

                {/* Pagination */}
                {pagination.totalItems > pagination.perPage && (
                  <CPagination className="mt-4">
                    <CPaginationItem 
                      disabled={pagination.currentPage === 1}
                      onClick={() => fetchMessages(pagination.currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    
                    {[...Array(Math.ceil(pagination.totalItems / pagination.perPage))].map((_, i) => (
                      <CPaginationItem
                        key={i + 1}
                        active={i + 1 === pagination.currentPage}
                        onClick={() => fetchMessages(i + 1)}
                      >
                        {i + 1}
                      </CPaginationItem>
                    ))}
                    
                    <CPaginationItem
                      disabled={pagination.currentPage === Math.ceil(pagination.totalItems / pagination.perPage)}
                      onClick={() => fetchMessages(pagination.currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                )}
              </>
            )}

            {/* No Messages Found */}
            {!loading && (!Array.isArray(messages) || messages.length === 0) && !error && !validationError && (
              <div className="text-center py-5">
                <div className="text-muted">No messages found with the current filters</div>
                <CButton color="primary" className="mt-3" onClick={resetFilters}>
                  Clear Filters
                </CButton>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default WhatsAppMessages;