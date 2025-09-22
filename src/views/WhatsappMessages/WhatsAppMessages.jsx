import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CFormInput,
  CFormSelect,
  CButton,
  CPagination,
  CPaginationItem,
  CFormLabel,
  CFormFeedback,
  CFormTextarea,
  CInputGroup,
  CListGroup,
  CListGroupItem,
  CContainer,
} from '@coreui/react';
import { cilFilter, cilReload, cilWarning, cilSend, cilUser, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const WhatsAppMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [filters, setFilters] = useState({
    date_after: '',
    date_before: '',
    limit: 20
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 1
  });
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

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

  // Group messages by conversation (sender) and apply pagination
  const processConversations = (messages, page = 1, perPage = 20) => {
    const conversationsMap = {};
    
    messages.forEach(message => {
      const phoneNumber = message.from;
      
      if (!conversationsMap[phoneNumber]) {
        conversationsMap[phoneNumber] = {
          phoneNumber,
          messages: [message],
          lastMessage: message
        };
      } else {
        conversationsMap[phoneNumber].messages.push(message);
        // Update if this is the most recent message
        if (new Date(message.date_sent) > new Date(conversationsMap[phoneNumber].lastMessage.date_sent)) {
          conversationsMap[phoneNumber].lastMessage = message;
        }
      }
    });
    
    const allConversations = Object.values(conversationsMap).sort((a, b) => 
      new Date(b.lastMessage.date_sent) - new Date(a.lastMessage.date_sent)
    );
    
    // Calculate pagination
    const totalItems = allConversations.length;
    const totalPages = Math.ceil(totalItems / perPage);
    
    // Apply pagination
    const startIndex = (page - 1) * perPage;
    const paginatedConversations = allConversations.slice(startIndex, startIndex + perPage);
    
    return {
      conversations: paginatedConversations,
      pagination: {
        currentPage: page,
        perPage,
        totalItems,
        totalPages
      }
    };
  };

  // Fetch only recent messages for better performance
  const fetchMessages = async (page = 1) => {
    if (!validateDates()) return;
    
    setLoading(true);
    setError('');
    setValidationError('');
    
    try {
      const requestData = { 
        ...filters, 
        page,
        limit: 20
      };
      
      const response = await axios.post('/getInboundMessages', requestData);
      
      if (response.data && response.data.success) {
        const messages = response.data.messages || [];
        
        // For each conversation, get only the last message from chat history
        const enhancedMessages = [...messages];
        
        // Set up auto-refresh for new messages
        if (!refreshIntervalRef.current) {
          refreshIntervalRef.current = setInterval(() => {
            refreshConversationList();
          }, 10000);
        }
        
        const { conversations: processedConversations, pagination: newPagination } = 
          processConversations(enhancedMessages, page, pagination.perPage);
        
        setConversations(processedConversations);
        setPagination(newPagination);
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

  // Refresh conversation list without full reload
  const refreshConversationList = async () => {
    try {
      const requestData = { 
        ...filters, 
        page: pagination.currentPage,
        limit: 20
      };
      
      const response = await axios.post('/getInboundMessages', requestData);
      
      if (response.data && response.data.success) {
        const newMessages = response.data.messages || [];
        
        // Update conversations with new messages
        setConversations(prev => {
          const updatedConversations = [...prev];
          
          newMessages.forEach(newMessage => {
            const existingConvIndex = updatedConversations.findIndex(
              conv => conv.phoneNumber === newMessage.from
            );
            
            if (existingConvIndex !== -1) {
              // Update existing conversation
              const existingConv = updatedConversations[existingConvIndex];
              if (new Date(newMessage.date_sent) > new Date(existingConv.lastMessage.date_sent)) {
                updatedConversations[existingConvIndex] = {
                  ...existingConv,
                  lastMessage: newMessage
                };
              }
            } else {
              // Add new conversation
              updatedConversations.push({
                phoneNumber: newMessage.from,
                messages: [newMessage],
                lastMessage: newMessage
              });
            }
          });
          
          return updatedConversations.sort((a, b) => 
            new Date(b.lastMessage.date_sent) - new Date(a.lastMessage.date_sent)
          );
        });
      }
    } catch (err) {
      console.error('Error refreshing conversations:', err);
    }
  };

  // Change conversations page
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchMessages(newPage);
    }
  };

  // Update conversations per page
  const updatePerPage = (newPerPage) => {
    const newPagination = {
      ...pagination,
      perPage: parseInt(newPerPage),
      currentPage: 1
    };
    setPagination(newPagination);
    fetchMessages(1);
  };

  // Load conversation messages
  const loadConversation = async (phoneNumber) => {
    setConversationLoading(true);
    try {
      const response = await axios.post('/chat-history', {
        phone_number: phoneNumber,
        limit: 50
      });
      
      if (response.data && response.data.success) {
        // Sort messages by timestamp (oldest first)
        const sortedMessages = response.data.chat_history.sort((a, b) => 
          new Date(a.date_sent) - new Date(b.date_sent)
        );
        
        setConversationMessages(sortedMessages);
        setSelectedConversation(phoneNumber);
        
        // Update the last message in the conversation list with the actual last message from chat history
        if (sortedMessages.length > 0) {
          const lastMessage = sortedMessages[sortedMessages.length - 1];
          setConversations(prev => prev.map(conv => 
            conv.phoneNumber === phoneNumber 
              ? { ...conv, lastMessage }
              : conv
          ));
        }
      } else {
        setError(response.data?.error || 'Failed to load conversation');
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError(err.response?.data?.error || 'Failed to load conversation');
    } finally {
      setConversationLoading(false);
    }
  };

  // Send reply
  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    setSendingReply(true);

    try {
      // Find the latest inbound message to get the SID
      const latestInboundMessage = conversationMessages
        .filter(msg => msg.direction === 'inbound')
        .sort((a, b) => new Date(b.date_sent) - new Date(a.date_sent))[0];

      if (!latestInboundMessage) {
        throw new Error('No inbound message found to reply to');
      }

      const response = await axios.post('/sendReply-inbound', {
        message_sid: latestInboundMessage.sid,
        message: replyText
      });

      if (response.data.success) {
        // Create a properly formatted timestamp for the new message
        const now = new Date();
        const formattedDate = now.toISOString();
        
        // Add the sent message to the conversation immediately
        const newMessage = {
          sid: response.data.conversation.reply_message.sid || `temp-${Date.now()}`,
          from: response.data.conversation.reply_message.from || "whatsapp:+14155238886",
          to: response.data.conversation.reply_message.to || selectedConversation,
          body: replyText,
          date_sent: formattedDate,
          status: 'sent',
          direction: 'outbound',
          timestamp: now.getTime()
        };
        
        setConversationMessages(prev => [...prev, newMessage]);
        setReplyText('');
        
        // Update the conversation list with the new message as the last message
        setConversations(prev => prev.map(conv => 
          conv.phoneNumber === selectedConversation 
            ? { 
                ...conv, 
                lastMessage: newMessage,
                messages: [...conv.messages, newMessage]
              }
            : conv
        ));
        
        // Simulate delivery status update after 2 seconds
        setTimeout(() => {
          setConversationMessages(prev => 
            prev.map(msg => 
              msg.sid === newMessage.sid 
                ? { ...msg, status: 'delivered' } 
                : msg
            )
          );
          
          // Update status in conversations list too
          setConversations(prev => prev.map(conv => 
            conv.phoneNumber === selectedConversation 
              ? { 
                  ...conv, 
                  lastMessage: {
                    ...conv.lastMessage,
                    status: 'delivered'
                  }
                }
              : conv
          ));
        }, 2000);
        
      } else {
        setError(response.data.error || 'Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred while sending reply');
    } finally {
      setSendingReply(false);
    }
  };

const formatTime = (dateString) => {
  if (!dateString) return '';

  try {
    // Force parse as UTC
    const utcDate = new Date(dateString);
    // Convert to local time manually
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

    return localDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error, dateString);
    return '';
  }
};

// Format relative time for conversation list - CORRECTED VERSION
const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Parse the date string as UTC
    let date = new Date(dateString);
    
    // If the date is invalid, try adding Z for UTC
    if (isNaN(date.getTime())) {
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const now = new Date();
    
    const diffInMs = now - localDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return localDate.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting relative time:', error, dateString);
    return '';
  }
};

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.replace('whatsapp:', '');
  };

  const renderStatusIndicator = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'failed':
        return '✗';
      default:
        return '';
    }
  };
  const formatChatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  } else if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'read':
        return 'primary';
      case 'delivered':
        return 'dark';
      case 'sent':
        return 'dark';
      case 'failed':
        return 'danger';
      default:
        return 'dark';
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

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if ((key === 'date_after' || key === 'date_before') && validationError) {
      setValidationError('');
    }
  };

  // Apply filters
  const applyFilters = () => {
    if (validateDates()) fetchMessages(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ date_after: '', date_before: '', limit: 20 });
    setValidationError('');
    fetchMessages(1);
  };

  // Load messages on component mount
  useEffect(() => {
    fetchMessages(1);
  }, []);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    items.push(
      <CPaginationItem 
        key="prev" 
        disabled={pagination.currentPage === 1}
        onClick={() => changePage(pagination.currentPage - 1)}
      >
        <CIcon icon={cilChevronLeft} />
      </CPaginationItem>
    );
    
    // First page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <CPaginationItem key={1} onClick={() => changePage(1)}>
          1
        </CPaginationItem>
      );
      if (startPage > 2) {
        items.push(<CPaginationItem key="ellipsis1" disabled>...</CPaginationItem>);
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <CPaginationItem 
          key={i} 
          active={i === pagination.currentPage}
          onClick={() => changePage(i)}
        >
          {i}
        </CPaginationItem>
      );
    }
    
    // Last page and ellipsis if needed
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        items.push(<CPaginationItem key="ellipsis2" disabled>...</CPaginationItem>);
      }
      items.push(
        <CPaginationItem 
          key={pagination.totalPages} 
          onClick={() => changePage(pagination.totalPages)}
        >
          {pagination.totalPages}
        </CPaginationItem>
      );
    }
    
    // Next button
    items.push(
      <CPaginationItem 
        key="next" 
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() => changePage(pagination.currentPage + 1)}
      >
        <CIcon icon={cilChevronRight} />
      </CPaginationItem>
    );
    
    return items;
  };

  return (
    <CContainer fluid className="vh-100">
      <CRow className="h-100">
        {/* Left Sidebar - Conversations List */}
        <CCol md={4} className="p-0 border-end">
          <CCard className="h-100 rounded-0" style={{ backgroundColor: '#f8f9fa' }}>
            <CCardHeader className="bg-white">
              <h5 className="mb-0">WhatsApp Conversations</h5>
              <div className="text-muted small">View all conversations</div>
            </CCardHeader>
            <CCardBody className="d-flex flex-column" style={{ overflow: 'hidden' }}>
              {/* Filters */}
              <div className="mb-3">
                <h6 className="mb-2">Filters</h6>
                <div className="row g-2">
                  <div className="col-6">
                    <CFormLabel className="small fw-semibold">Start Date</CFormLabel>
                    <CFormInput
                      type="date"
                      value={filters.date_after}
                      onChange={(e) => handleFilterChange('date_after', e.target.value)}
                      invalid={isDateRangeInvalid()}
                      size="sm"
                    />
                  </div>
                  <div className="col-6">
                    <CFormLabel className="small fw-semibold">End Date</CFormLabel>
                    <CFormInput
                      type="date"
                      value={filters.date_before}
                      onChange={(e) => handleFilterChange('date_before', e.target.value)}
                      invalid={isDateRangeInvalid()}
                      size="sm"
                    />
                  </div>
                  <div className="col-6">
                    <CFormLabel className="small fw-semibold">Messages per Page</CFormLabel>
                    <CFormSelect
                      value={filters.limit}
                      onChange={(e) => handleFilterChange('limit', e.target.value)}
                      size="sm"
                    >
                      <option value={20}>20 messages</option>
                      <option value={50}>50 messages</option>
                      <option value={100}>100 messages</option>
                    </CFormSelect>
                  </div>
                  <div className="col-6">
                    <CFormLabel className="small fw-semibold">Conversations per Page</CFormLabel>
                    <CFormSelect
                      value={pagination.perPage}
                      onChange={(e) => updatePerPage(e.target.value)}
                      size="sm"
                    >
                      <option value={10}>10 conversations</option>
                      <option value={20}>20 conversations</option>
                      <option value={50}>50 conversations</option>
                    </CFormSelect>
                  </div>
                  <div className="col-12 d-flex gap-2 mt-2">
                    <CButton 
                      color="primary" 
                      size="sm" 
                      onClick={applyFilters}
                      disabled={isDateRangeInvalid()}
                      className="flex-fill"
                    >
                      <CIcon icon={cilFilter} className="me-1" />
                      Apply Filters
                    </CButton>
                    <CButton color="secondary" size="sm" onClick={resetFilters}>
                      <CIcon icon={cilReload} />
                    </CButton>
                  </div>
                </div>
              </div>

              {/* Validation Error Alert */}
              {validationError && (
                <CAlert color="warning" className="py-2 mb-2">
                  <CIcon icon={cilWarning} className="me-1" />
                  {validationError}
                </CAlert>
              )}

              {/* API Error Alert */}
              {error && (
                <CAlert color="danger" className="py-2 mb-2">
                  {error}
                </CAlert>
              )}

              {/* Loading Spinner */}
              {loading && (
                <div className="text-center py-3">
                  <CSpinner color="primary" size="sm" />
                  <div className="mt-2 small">Loading conversations...</div>
                </div>
              )}

              {/* Conversations List Container with Scroll */}
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {!loading && Array.isArray(conversations) && conversations.length > 0 && (
                  <>
                    <div className="mb-2 text-muted small">
                      Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to{' '}
                      {Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)} of{' '}
                      {pagination.totalItems} conversations
                    </div>
                    
                    <CListGroup>
                      {conversations.map((conversation) => (
                        <CListGroupItem 
                          key={conversation.phoneNumber}
                          className={`d-flex justify-content-between align-items-center cursor-pointer ${selectedConversation === conversation.phoneNumber ? 'active' : ''}`}
                          onClick={() => loadConversation(conversation.phoneNumber)}
                          style={{ 
                            cursor: 'pointer',
                           backgroundColor: selectedConversation === conversation.phoneNumber ? '#321fdb' : '#fff'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <CIcon icon={cilUser} />
                            </div>
                            <div className="ms-2">
                              <h6 className="mb-0">{formatPhoneNumber(conversation.phoneNumber)}</h6>
                              <p className="mb-0 text-truncate small" style={{ maxWidth: '150px' }}>
                                {conversation.lastMessage.body || 'No message content'}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex flex-column align-items-end">
                            <small className="text-muted">
                              {formatRelativeTime(conversation.lastMessage.date_sent)}
                            </small>
                          </div>
                        </CListGroupItem>
                      ))}
                    </CListGroup>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-3">
                        <CPagination size="sm">
                          {renderPaginationItems()}
                        </CPagination>
                      </div>
                    )}
                  </>
                )}

                {/* No Conversations Found */}
                {!loading && (!Array.isArray(conversations) || conversations.length === 0) && !error && !validationError && (
                  <div className="text-center py-4">
                    <div className="text-muted small">No conversations found</div>
                    <CButton color="primary" size="sm" className="mt-2" onClick={resetFilters}>
                      Clear Filters
                    </CButton>
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Side - Conversation View */}
        <CCol md={8} className="p-0 d-flex">
          {selectedConversation ? (
            <CCard className="flex-fill rounded-0 d-flex flex-column" style={{ backgroundColor: '#f0f2f5' }}>
              <CCardHeader className="bg-white d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatPhoneNumber(selectedConversation)}</h6>
                  <small className="text-muted">{conversationMessages.length} messages</small>
                </div>
              </CCardHeader>
              
              {/* Messages Container with Fixed Height and Scroll */}
              <div 
                className="flex-fill p-3" 
                style={{ 
                  overflowY: 'auto',
                  minHeight: 0,
                  maxHeight: 'calc(100vh - 150px)',
                  backgroundColor: '#f0f2f5'
                }}
              >
                {conversationLoading ? (
                  <div className="text-center py-5">
                    <CSpinner color="primary" />
                    <div className="mt-2">Loading conversation...</div>
                  </div>
                ) : (
                 <div className="d-flex flex-column">
  {conversationMessages.map((message, index) => {
    const prevMsg = conversationMessages[index - 1];
    const currentDate = new Date(message.date_sent).toDateString();
    const prevDate = prevMsg ? new Date(prevMsg.date_sent).toDateString() : null;

    const showDateSeparator = currentDate !== prevDate;

    return (
      <React.Fragment key={index}>
        {showDateSeparator && (
          <div className="text-center my-2">
            <span className="badge bg-secondary">
              {formatChatDate(message.date_sent)}
            </span>
          </div>
        )}

        <div
          className={`d-flex mb-3 ${message.direction === 'inbound' ? 'justify-content-start' : 'justify-content-end'}`}
        >
          <div
            className={`p-3 rounded ${message.direction === 'inbound' ? 'bg-white border' : 'bg-primary text-white'}`}
            style={{ maxWidth: '70%', minWidth: '120px' }}
          >
            <div className="message-text mb-1">{message.body}</div>
            <div
              className={`small ${
                message.direction === 'inbound' ? 'text-muted' : 'text-white-50'
              } d-flex justify-content-between align-items-center`}
            >
              <span>{formatTime(message.date_sent)}</span>
              {message.direction === 'outbound' && (
                <span className={`ms-2 text-${getStatusColor(message.status)}`}>
                  {renderStatusIndicator(message.status)}
                </span>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  })}
  <div ref={messagesEndRef} />
</div>

                )}
              </div>

              {/* Reply Input Section - Fixed at Bottom */}
              <div className="border-top p-3 bg-white">
                <CInputGroup>
                  <CFormTextarea
                    rows="1"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sendingReply || conversationLoading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                    style={{ resize: 'none' }}
                  />
                  <CButton 
                    color="primary" 
                    onClick={sendReply}
                    disabled={sendingReply || !replyText.trim() || conversationLoading}
                  >
                    {sendingReply ? (
                      <CSpinner size="sm" />
                    ) : (
                      <CIcon icon={cilSend} />
                    )}
                  </CButton>
                </CInputGroup>
              </div>
            </CCard>
          ) : (
            <div className="d-flex justify-content-center align-items-center flex-fill bg-light">
              <div className="text-center text-muted">
                <CIcon icon={cilUser} size="3xl" className="mb-3" />
                <h5>Select a conversation</h5>
                <p>Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default WhatsAppMessages;