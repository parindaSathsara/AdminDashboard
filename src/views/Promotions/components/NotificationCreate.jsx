import React, { useEffect, useState } from 'react'
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
  CBadge,
} from '@coreui/react'
import { Box, Typography, LinearProgress } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'

function NotificationCreate({ onNotificationCreated }) {
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState(0)
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userSuggestions, setUserSuggestions] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [selectedOptionLabel, setSelectedOptionLabel] = useState('Select Notification Type *')

  const [formData, setFormData] = useState({
    topic_id: '',
    title: '',
    content: '',
  })
  const [loading, setLoading] = useState(false)

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
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'topic_id') {
      // Show user selection if "Direct Notification" is selected
      const isDirectNotification = value === 'direct'
      setShowUserSelection(isDirectNotification)
      
      // Update the selected option label
      if (value === 'direct') {
        setSelectedOptionLabel('Direct Notification *')
      } else if (value === '') {
        setSelectedOptionLabel('Select Notification Type *')
      } else {
        // Find the selected topic name
        const selectedTopic = topics.find(topic => topic.id == value)
        setSelectedOptionLabel(selectedTopic ? `${selectedTopic.topic} *` : 'Select Notification Type *')
      }
      
      setFormData({
        ...formData,
        [name]: value === 'direct' ? 'direct' : value, // Keep 'direct' value for display
      })
      
      // Clear selected users when switching away from direct notification
      if (!isDirectNotification) {
        setSelectedUsers([])
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Fetch user suggestions based on search input
  const fetchUserSuggestions = async (searchTerm) => {
    setIsLoadingUsers(true)
    try {
      const response = await axios.get(`/users?search=${searchTerm}`)
      
      if (response.data && response.data.users && response.data.users.data) {
        setUserSuggestions(response.data.users.data)
      } else {
        setUserSuggestions([])
      }
    } catch (error) {
      console.log('Error fetching users:', error)
      setUserSuggestions([])
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Debounce the user search to avoid too many API calls
  useEffect(() => {
    if (userSearch.trim() === '') {
      setUserSuggestions([])
      return
    }

    const delayDebounceFn = setTimeout(() => {
      fetchUserSuggestions(userSearch)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [userSearch])

  const handleUserSearch = (e) => {
    setUserSearch(e.target.value)
  }

  const handleUserSelect = (user) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user])
    }
    setUserSearch('')
    setUserSuggestions([])
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if Direct Notification is selected
    const isDirectNotification = formData.topic_id === 'direct'
    
    if (isDirectNotification) {
      // For direct notification: validate title, content, and users
      if (!formData.title || !formData.content || selectedUsers.length === 0) {
        Swal.fire('Error', 'Please fill all the fields and select at least one user', 'error')
        return
      }
    } else {
      // For topic notification: validate topic, title, and content
      if (!formData.topic_id || !formData.title || !formData.content) {
        Swal.fire('Error', 'Please fill all the fields', 'error')
        return
      }
    }

    // Prepare submission data according to your backend structure
    const submissionData = {
      title: formData.title,
      content: formData.content,
      index: 1,
    }

    // Add topic_id for topic notifications or user_ids for direct notifications
    if (isDirectNotification) {
      submissionData.user_ids = selectedUsers.map((user) => user.id)
      submissionData.topic_id = '' // Empty for backend's case null: logic
    } else {
      submissionData.topic_id = parseInt(formData.topic_id) // Ensure it's an integer
    }

    let max_requests = 1
    let total_users = 0
    setLoading(true)
    
    while (submissionData.index <= max_requests) {
      try {
        const response = await axios.post('promotions/send_notifications', submissionData)
        total_users = response.data.total_users ?? 0
        max_requests = response?.data?.max_requests ?? 1
        let progress = ((submissionData.index / max_requests) * 100).toFixed(2)
        setProgress(parseInt(progress))
        submissionData.index += 1
      } catch (error) {
        setProgress(0)
        setLoading(false)
        console.log('Error sending notification:', error)
        
        // Show detailed error message from backend
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.topic_id?.[0] || 
                           'Failed to send notification'
        Swal.fire('Error', errorMessage, 'error')
        return
      }
    }

    setProgress(0)
    setLoading(false)
    setFormData({ 
      topic_id: '', 
      title: '', 
      content: '',
    })
    setSelectedUsers([])
    setShowUserSelection(false)
    setSelectedOptionLabel('Select Notification Type *')
    onNotificationCreated()
    Swal.fire('Success', `Notification sent successfully to ${total_users} users.`, 'success')
  }

  const handleClear = () => {
    setFormData({
      topic_id: '',
      title: '',
      content: '',
    })
    setSelectedUsers([])
    setShowUserSelection(false)
    setUserSearch('')
    setUserSuggestions([])
    setSelectedOptionLabel('Select Notification Type *')
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/promotions/topics/all')
      setTopics(response.data.topics || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <Typography variant="h6" gutterBottom>
          Send Promotion Topic Notification
        </Typography>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormSelect
                label={selectedOptionLabel}
                name="topic_id"
                value={formData.topic_id}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option value="direct">Direct Notification</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.topic} 
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* User Selection (only show when Direct Notification is selected) */}
          {showUserSelection && (
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="userSearch">Select Users for Direct Notification *</CFormLabel>
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
                        {userSuggestions.map((user) => (
                          <CListGroupItem
                            key={user.id}
                            action
                            onClick={() => handleUserSelect(user)}
                            style={styles.suggestionItem}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = ''
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
                      <h6>Selected Users ({selectedUsers.length}):</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedUsers.map((user) => (
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
                <small className="text-muted">
                  Select one or more users to send direct notification
                </small>
              </CCol>
            </CRow>
          )}

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                type="text"
                label="Notification Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormTextarea
                label="Notification Content *"
                name="content"
                rows="4"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter notification content"
                required
              />
            </CCol>
          </CRow>
          
          {progress > 0 && (
            <CRow>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {progress === 100 ? 'Notification Sent!' : 'Sending Notification...'}
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
          
          <div className="d-flex gap-3 justify-content-end">
            <CButton color="secondary" variant="outline" type="button" onClick={handleClear}>
              Clear
            </CButton>
            <Box textAlign="right">
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Notification'}
              </CButton>
            </Box>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default NotificationCreate