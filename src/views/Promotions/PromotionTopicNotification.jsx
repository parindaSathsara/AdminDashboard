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
} from '@coreui/react'
import { Box, Typography, LinearProgress } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'

function PromotionTopicNotification() {
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState(0)

  const [formData, setFormData] = useState({
    topic_id: '',
    title: '',
    content: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.topic_id || !formData.title || !formData.content) {
      Swal.fire('Error', 'Please fill all the fields', 'error')
      return
    }
    formData.index = 1
    let max_requests = 1
    let total_users = 0
    setLoading(true)
    while (formData.index <= max_requests) {
      try {
        const response = await axios.post('promotions/send_notifications', formData)
        total_users = response.data.total_users ?? 0
        max_requests = response?.data?.max_requests ?? 1
        let progress = ((formData.index / max_requests) * 100).toFixed(2)
        setProgress(parseInt(progress))
        formData.index += 1
      } catch (error) {
        setProgress(0)
        setLoading(false)
        console.log('Error sending notification:', error)
        Swal.fire('Error', 'Failed to send notification', 'error')
        break
      }
    }

    setProgress(0)
    setLoading(false)
    setFormData({ topic_id: '', title: '', content: '' })
    Swal.fire('Success', `Notification sent successfully to ${total_users} users.`, 'success')
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
                label="Select Topic"
                name="topic_id"
                value={formData.topic_id}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.topic}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                type="text"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormTextarea
                label="Description"
                name="content"
                rows="4"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter notification description"
              />
            </CCol>
          </CRow>
          {progress > 0 && (
            <CRow>
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {progress == 100 ? 'Topic Created!' : 'Creating Topic...'}
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

          <Box textAlign="right">
            <CButton type="submit" color="primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Notification'}
            </CButton>
          </Box>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default PromotionTopicNotification
