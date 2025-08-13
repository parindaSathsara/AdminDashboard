import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CBadge, CButton, CRow, CCol, CSpinner } from '@coreui/react'
import { Box, Typography, LinearProgress } from '@mui/material'
import './TopicList.css'
import axios from 'axios'
import Swal from 'sweetalert2'

function TopicList(props) {
  const [topics, setTopics] = useState([])
  const [progressByTopic, setProgressByTopic] = useState({})
  const [updatingIds, setUpdatingIds] = useState([])

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/promotions/topics/all')
      setTopics(response.data.topics || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const updateProgress = (topic_id, value) => {
    setProgressByTopic((prev) => ({
      ...prev,
      [topic_id]: value,
    }))
  }

  const handleUpdate = async (topic_id) => {
    setUpdatingIds((prev) => [...prev, topic_id])
    updateProgress(topic_id, 1)
    let index = 1
    let max_requests = 1
    while (index <= max_requests) {
      try {
        const response = await axios.post(
          '/promotions/update_topic',
          {
            topic_id: topic_id,
            index: index,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        max_requests = response?.data?.max_requests ?? 1
        let progress = ((index / max_requests) * 100).toFixed(2)
        updateProgress(topic_id, parseInt(progress))
        index += 1
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
    updateProgress(topic_id, 0)
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
                      <CBadge color={typeColors[topic.status]}>{topic.status}</CBadge>
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
                      <CButton
                        size="sm"
                        color="primary"
                        variant="outline"
                        disabled={updatingIds.includes(topic.id)} // disable while loading
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
                    </div>
                    {updatingIds.includes(topic.id) && progressByTopic[topic.id] > 0 && (
                      <CRow>
                        <Box sx={{ mt: 3, mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {progressByTopic[topic.id] == 100
                              ? 'Topic Updated!'
                              : 'Updating Topic...'}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={progressByTopic[topic.id]}
                            sx={{ height: 3, borderRadius: 5 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {progressByTopic[topic.id]}%
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
  )
}

export default TopicList
