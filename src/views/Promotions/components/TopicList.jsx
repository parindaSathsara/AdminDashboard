import React, { useState, useEffect } from 'react'
import { 
  CCard, CCardBody, CBadge, CButton, CRow, CCol, CSpinner,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import { Box, Typography, LinearProgress } from '@mui/material'
import './TopicList.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import TopicEditModal from './TopicEditModal' // We'll create this component

function TopicList(props) {
  const [topics, setTopics] = useState([])
  const [progressByTopic, setProgressByTopic] = useState({})
  const [updatingIds, setUpdatingIds] = useState([])
  const [editingTopic, setEditingTopic] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/promotions/topics/all')
      setTopics(response.data.topics || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const handleEdit = async (topic) => {
    try {
      // Fetch topic details with user information
      const response = await axios.get(`/promotions/topic/${topic.id}`)
      
      if (response.data.success) {
        setEditingTopic(response.data)
        setEditModalVisible(true)
      } else {
        Swal.fire('Error', 'Failed to fetch topic details', 'error')
      }
    } catch (error) {
      console.error('Error fetching topic details:', error)
      Swal.fire('Error', 'Failed to fetch topic details', 'error')
    }
  }

  const handleUpdateTopic = async (updatedData) => {
    try {
      const response = await axios.put(`/promotions/topic/${editingTopic.topic.id}`, updatedData)
      
      if (response.data.success) {
        Swal.fire('Success', 'Topic updated successfully!', 'success')
        setEditModalVisible(false)
        setEditingTopic(null)
        fetchTopics() // Refresh the list
        props.onTopicUpdated?.() // Notify parent if needed
      } else {
        Swal.fire('Error', response.data.message, 'error')
      }
    } catch (error) {
      console.error('Error updating topic:', error)
      Swal.fire('Error', 'Failed to update topic', 'error')
    }
  }

  const handleUpdate = async (topic_id) => {
    setUpdatingIds((prev) => [...prev, topic_id])
    
    let update_index = 1
    let update_max_requests = 1
    updateProgress(topic_id, 0, 'Adding new users to the topic...')
    
    while (update_index <= update_max_requests) {
      try {
        const response = await axios.post(
          '/promotions/update_topic',
          {
            topic_id: topic_id,
            index: update_index,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        update_max_requests = response?.data?.max_requests ?? 1
        let progress = ((update_index / update_max_requests) * 100).toFixed(2)
        updateProgress(topic_id, parseInt(progress), 'Adding new users to the topic...')
        update_index += 1
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error?.response?.data?.message ?? error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        return
      }
    }
    updateProgress(topic_id, 0, '')
    setUpdatingIds((prev) => prev.filter((num) => num !== topic_id))
  }

  useEffect(() => {
    fetchTopics()
  }, [props.isTopicCreated, updatingIds])

  const typeColors = {
    active: 'success',
    pending: 'warning',
    inactive: 'danger',
  }

  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardBody>
          <h3 className="fw-bold mb-3">📋 Created Topics</h3>

          <CRow className="g-4">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <CCol key={topic.id} xs={12} sm={6} lg={4}>
                  <CCard className="topic-card border-1 h-100">
                    <CCardBody>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0 topic-title">{topic.topic}</h5>
                        <div>
                          <CBadge color={typeColors[topic.status]}>{topic.status}</CBadge>
                          {topic.type === 'custom_topic' && (
                            <CBadge color="info" className="ms-1">Custom</CBadge>
                          )}
                        </div>
                      </div>

                      <p className="text-muted small mb-3">{topic.description}</p>

                      <div className="topic-stats">
                        <div className="stat-item">
                          <span className="stat-value">{topic.total_users}</span>
                          <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{topic.total_devices}</span>
                          <span className="stat-label">Total Devices</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{topic.success_devices ?? 0}</span>
                          <span className="stat-label">Success Devices</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        {/* Show Edit button for custom topics */}
                        {topic.type === 'custom_topic' && (
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            onClick={() => handleEdit(topic)}
                          >
                            <i className="fa fa-edit" aria-hidden="true"></i> Edit
                          </CButton>
                        )}

                        {/* Show Refresh button for regular topics */}
                        {topic.type !== 'custom_topic' && (
                          <CButton
                            size="sm"
                            color="primary"
                            variant="outline"
                            disabled={updatingIds.includes(topic.id)}
                            onClick={() => handleUpdate(topic.id)}
                          >
                            {updatingIds.includes(topic.id) ? (
                              <>
                                <CSpinner size="sm" className="me-2" /> Loading...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-refresh" aria-hidden="true"></i> Refresh
                              </>
                            )}
                          </CButton>
                        )}
                      </div>

                      <div className="text-muted small mt-2">
                        Last updated at:{' '}
                        {topic.updated_at ? new Date(topic.updated_at).toLocaleString() : 'Never'}
                      </div>

                      {updatingIds.includes(topic.id) && progressByTopic[topic.id]?.progress > 0 && (
                        <CRow>
                          <Box sx={{ mt: 3, mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {progressByTopic[topic.id]?.message}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={progressByTopic[topic.id]?.progress}
                              sx={{ height: 3, borderRadius: 5 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {progressByTopic[topic.id]?.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        </CRow>
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
              ))
            ) : (
              <p className="text-muted text-center">No topics found.</p>
            )}
          </CRow>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {editingTopic && (
        <TopicEditModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          topic={editingTopic}
          onSave={handleUpdateTopic}
        />
      )}
    </>
  )
}

export default TopicList