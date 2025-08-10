import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CBadge, CButton, CRow, CCol } from '@coreui/react'
import './TopicList.css'
import axios from 'axios'

function TopicList() {
  const [topics, setTopics] = useState([])

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/promotions/topics/all')
      setTopics(response.data.topics || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

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
                        <span className="stat-value">{topic.total_devices}</span>
                        <span className="stat-label">Total Devices</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{topic.success_devices ?? 0}</span>
                        <span className="stat-label">Success Devices</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{topic.total_users}</span>
                        <span className="stat-label">Total Users</span>
                      </div>
                    </div>

                    {/* <div className="d-flex gap-2 mt-3">
                      <CButton size="sm" color="primary" variant="outline">
                        Edit
                      </CButton>
                      <CButton size="sm" color="danger" variant="outline">
                        Delete
                      </CButton>
                    </div> */}
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
