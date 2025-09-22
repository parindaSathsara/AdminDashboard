// TopicEditModal.jsx
import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CFormLabel,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import axios from 'axios'
import Swal from 'sweetalert2'

function TopicEditModal({ visible, onClose, topic, onSave }) {
  const [formData, setFormData] = useState({
    topic_name: '',
    description: '',
    user_ids: []
  })
  const [userSearch, setUserSearch] = useState('')
  const [userSuggestions, setUserSuggestions] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (topic) {
      setFormData({
        topic_name: topic.topic.topic || '',
        description: topic.topic.description || '',
        user_ids: topic.user_ids || []
      })
      setSelectedUsers(topic.users || [])
    }
  }, [topic])

  const fetchUserSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setUserSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get(`/users?search=${searchTerm}`)
      if (response.data && response.data.users && response.data.users.data) {
        setUserSuggestions(response.data.users.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSearch = (e) => {
    const value = e.target.value
    setUserSearch(value)
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchUserSuggestions(value)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const handleUserSelect = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user])
      setFormData(prev => ({
        ...prev,
        user_ids: [...prev.user_ids, user.id]
      }))
    }
    setUserSearch('')
    setUserSuggestions([])
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId))
    setFormData(prev => ({
      ...prev,
      user_ids: prev.user_ids.filter(id => id !== userId)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.user_ids.length === 0) {
      Swal.fire('Error', 'Please select at least one user', 'error')
      return
    }

    onSave(formData)
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Edit Custom Topic</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel>Topic Name</CFormLabel>
            <CFormInput
              type="text"
              value={formData.topic_name}
              onChange={(e) => setFormData(prev => ({ ...prev, topic_name: e.target.value }))}
              required
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Description</CFormLabel>
            <CFormTextarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Select Users</CFormLabel>
            <CFormInput
              type="text"
              value={userSearch}
              onChange={handleUserSearch}
              placeholder="Search users..."
            />
            
            {userSuggestions.length > 0 && (
              <CListGroup className="mt-2">
                {userSuggestions.map(user => (
                  <CListGroupItem 
                    key={user.id} 
                    action 
                    onClick={() => handleUserSelect(user)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.username} - {user.email}
                  </CListGroupItem>
                ))}
              </CListGroup>
            )}

            {selectedUsers.length > 0 && (
              <div className="mt-3">
                <h6>Selected Users:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <CBadge
                      key={user.id}
                      color="primary"
                      className="p-2 d-flex align-items-center"
                    >
                      {user.username} ({user.email})
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        aria-label="Close"
                        onClick={() => handleRemoveUser(user.id)}
                        style={{ fontSize: '0.75rem' }}
                      ></button>
                    </CBadge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Save Changes
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default TopicEditModal