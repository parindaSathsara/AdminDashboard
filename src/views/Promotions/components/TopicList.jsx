import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CBadge, CButton, CRow, CCol } from '@coreui/react'
import './TopicList.css' // Import the custom CSS
import axios from 'axios'

function TopicList() {
  const [topics, setTopics] = useState([])

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/promotions/topics/all')
      console.log('Topics', response.data)

      setTopics(response.data.topics || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }
  useEffect(() => {
    fetchTopics()
  }, [])
  const typeColors = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'danger',
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h3 className="fw-bold mb-3">📋 Created Topics</h3>

        <CRow className="g-3">
          {topics.map((topic) => (
            <CCol key={topic.id} md={6} lg={4}>
              <CCard className="topic-card border-0 shadow-sm h-100">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{topic.topic}</h5>
                    <CBadge color={typeColors[topic.status]}>{topic.status}</CBadge>
                  </div>
                  <p className="small text-secondary mb-3">{topic.description}</p>
                  <div className="d-flex gap-2">
                    <CButton size="sm" color="primary" variant="outline">
                      Edit
                    </CButton>
                    <CButton size="sm" color="danger" variant="outline">
                      Delete
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default TopicList
