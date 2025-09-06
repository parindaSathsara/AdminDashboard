import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CListGroup,
  CListGroupItem,
  CBadge
} from '@coreui/react';
import { Box, Typography, LinearProgress } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

function TopicCreate({ onTopicCreated }) {
  const [progress, setProgress] = useState(0);
  const [topicTitles, setTopicTitles] = useState([]);
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    customTopic: '',
    description: '',
  });

  // Internal CSS styles
  const styles = {
    userSelectionContainer: {
      position: 'relative',
    },
    suggestionsDropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      maxHeight: '200px',
      overflowY: 'auto',
      border: '1px solid #ccc',
      borderRadius: '0.375rem',
      backgroundColor: 'white',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    },
    suggestionItem: {
      cursor: 'pointer',
    },
    suggestionItemHover: {
      backgroundColor: '#f8f9fa',
    },
    userBadge: {
      fontSize: '0.875rem',
    },
    closeButton: {
      fontSize: '0.75rem',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      marginLeft: '0.5rem',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  const fetchTopicTitles = async () => {
    try {
      const response = await axios.get('/promotions/topics-titles/all');
      setTopicTitles(response?.data?.topic_titles || []);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  };

  // Fetch user suggestions based on search input
  const fetchUserSuggestions = async (searchTerm) => {
    setIsLoadingUsers(true);
    try {
      console.log('Fetching users with search term:', searchTerm);
      const response = await axios.get(`/users?search=${searchTerm}`);
      console.log('User API response:', response.data);
      
      // Check if the response has the expected structure
      if (response.data && response.data.users && response.data.users.data) {
        setUserSuggestions(response.data.users.data);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setUserSuggestions([]);
        Swal.fire({
          title: 'API Error',
          text: 'Unexpected response format from server',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log('Error fetching users:', error);
      setUserSuggestions([]);
      Swal.fire({
        title: 'Network Error',
        text: 'Could not fetch users. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Debounce the user search to avoid too many API calls
  useEffect(() => {
    if (userSearch.trim() === '') {
      setUserSuggestions([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(() => {
      fetchUserSuggestions(userSearch);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'topic') {
      // Show custom topic input if "Custom Topic" is selected
      setShowCustomTopicInput(value === 'custom_topic');
      setShowUserSelection(value === 'custom_topic');
      
      // Reset custom topic field if switching away from custom
      if (value !== 'custom_topic') {
        setFormData(prev => ({
          ...prev,
          customTopic: '',
          [name]: value
        }));
        setSelectedUsers([]);
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUserSearch = (e) => {
    setUserSearch(e.target.value);
  };

  const handleUserSelect = (user) => {
    // Check if user is already selected
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setUserSearch('');
    setUserSuggestions([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.topic === 'custom_topic' && !formData.customTopic.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a custom topic name',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    
    // Validate users if custom topic is selected
    if (formData.topic === 'custom_topic' && selectedUsers.length === 0) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please select at least one user for the custom topic',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    
    // Use custom topic if selected, otherwise use the selected topic
    const finalTopic = formData.topic === 'custom_topic' ? formData.customTopic : formData.topic;
    
    // Prepare user IDs for submission
    const userIds = formData.topic === 'custom_topic' ? selectedUsers.map(user => user.id) : [];
    
    const submissionData = {
      topic: finalTopic,
      description: formData.description,
      index: 1,
      users: userIds
    };
    
    console.log('Submitting data:', submissionData);
    
    let max_requests = 1;
    while (submissionData.index <= max_requests) {
      try {
        const response = await axios.post('/promotions/create_topic', submissionData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        max_requests = response?.data?.max_requests ?? 1;
        let progress = ((submissionData.index / max_requests) * 100).toFixed(2);
        setProgress(parseInt(progress));
        submissionData.index += 1;
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error?.response?.data?.message ?? error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
    }
    
    setFormData({
      topic: '',
      customTopic: '',
      description: '',
    });
    setShowCustomTopicInput(false);
    setShowUserSelection(false);
    setSelectedUsers([]);
    setProgress(0);
    onTopicCreated();
    Swal.fire({
      title: 'Success',
      text: 'Promotion topic created successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const handleClear = () => {
    setFormData({
      topic: '',
      customTopic: '',
      description: '',
    });
    setShowCustomTopicInput(false);
    setShowUserSelection(false);
    setSelectedUsers([]);
    setUserSearch('');
    setUserSuggestions([]);
  };

  useEffect(() => {
    fetchTopicTitles();
  }, []);

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h3 className="fw-bold mb-2">Create New Topic</h3>
        <p className="text-muted mb-4">Fill out the details to add a new promotion topic.</p>

        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol md={12} className="mb-4">
              <CFormSelect
                name="topic"
                label="Select Topic *"
                value={formData.topic}
                onChange={handleChange}
                required
              >
                <option value="">Select a topic</option>
                {topicTitles.map((title) => {
                  const formattedTitle = title
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  return (
                    <option key={title} value={title}>
                      {formattedTitle}
                    </option>
                  );
                })}
                <option value="custom_topic">+ Custom Topic</option>
              </CFormSelect>
            </CCol>
          </CRow>
          
          {showCustomTopicInput && (
            <>
              <CRow>
                <CCol md={12} className="mb-4">
                  <CFormLabel htmlFor="customTopic">Custom Topic Name *</CFormLabel>
                  <CFormInput
                    id="customTopic"
                    name="customTopic"
                    type="text"
                    value={formData.customTopic}
                    onChange={handleChange}
                    placeholder="Enter your custom topic name"
                    required={showCustomTopicInput}
                  />
                </CCol>
              </CRow>
              
              {showUserSelection && (
                <CRow>
                  <CCol md={12} className="mb-4">
                    <CFormLabel htmlFor="userSearch">Select Users *</CFormLabel>
                    <div style={styles.userSelectionContainer}>
                      <CFormInput
                        id="userSearch"
                        type="text"
                        value={userSearch}
                        onChange={handleUserSearch}
                        placeholder="Search users by username or email"
                      />
                      {isLoadingUsers && (
                        <div className="mt-2">
                          <small>Searching users...</small>
                          <div style={styles.loadingSpinner}></div>
                        </div>
                      )}
                      
                      {userSuggestions.length > 0 && (
                        <div style={styles.suggestionsDropdown}>
                          <CListGroup>
                            {userSuggestions.map(user => (
                              <CListGroupItem 
                                key={user.id} 
                                action 
                                onClick={() => handleUserSelect(user)}
                                style={styles.suggestionItem}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = styles.suggestionItemHover.backgroundColor;
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '';
                                }}
                              >
                                <div>
                                  <strong>{user.username || 'No Name'}</strong>
                                  <br />
                                  <small className="text-muted">{user.email}</small>
                                </div>
                              </CListGroupItem>
                            ))}
                          </CListGroup>
                        </div>
                      )}
                      
                      {selectedUsers.length > 0 && (
                        <div className="selected-users mt-3">
                          <h6>Selected Users:</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedUsers.map(user => (
                              <CBadge 
                                key={user.id} 
                                color="primary" 
                                className="p-2 d-flex align-items-center"
                                style={styles.userBadge}
                              >
                                {user.username} ({user.email})
                                <button 
                                  type="button" 
                                  className="btn-close btn-close-white ms-2"
                                  aria-label="Close"
                                  onClick={() => handleRemoveUser(user.id)}
                                  style={styles.closeButton}
                                ></button>
                              </CBadge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CCol>
                </CRow>
              )}
            </>
          )}
          
          <CRow>
            <CCol className="mb-3">
              <CFormTextarea
                name="description"
                label="Remarks *"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description"
                rows={4}
                required
              />
            </CCol>
          </CRow>
          
          {progress > 0 && (
            <CRow>
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {progress === 100 ? 'Topic Created!' : 'Creating Topic...'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {progress}%
                  </Typography>
                </Box>
              </Box>
            </CRow>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-end">
            <CButton color="secondary" variant="outline" type="button" onClick={handleClear}>
              Clear
            </CButton>
            <CButton color="primary" type="submit">
              Create
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
}

export default TopicCreate;