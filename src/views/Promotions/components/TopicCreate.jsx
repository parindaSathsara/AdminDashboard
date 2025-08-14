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

function TopicCreate({ onTopicCreated }) {
  const [progress, setProgress] = useState(0)
  const [topicTitles, setTopicTitles] = useState([])
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
  })

  const fetchTopicTitles = async () => {
    try {
      const response = await axios.get('/promotions/topics-titles/all')
      setTopicTitles(response?.data?.topic_titles || [])
    } catch (error) {
      console.log('Error fetching notifications:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    formData.index = 1
    let max_requests = 1
    while (formData.index <= max_requests) {
      try {
        const response = await axios.post('/promotions/create_topic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        max_requests = response?.data?.max_requests ?? 1
        let progress = ((formData.index / max_requests) * 100).toFixed(2)
        setProgress(parseInt(progress))
        formData.index += 1
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error?.response?.data?.message ?? error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        return
        break
      }
    }
    setFormData({
      topic: '',
      description: '',
    })
    setProgress(0)
    onTopicCreated()
    Swal.fire({
      title: 'Success',
      text: 'Promotion topic created successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    })
  }

  const handleClear = () => {
    setFormData({
      topic: '',
      description: '',
    })
  }
  useEffect(() => {
    fetchTopicTitles()
  }, [])

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
                label="Select Topic"
                value={formData.topic}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                {topicTitles.map((title) => {
                  const formattedTitle = title
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                  return (
                    <option key={title} value={title}>
                      {formattedTitle}
                    </option>
                  )
                })}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol className="mb-3">
              <CFormTextarea
                name="description"
                label="Remarks"
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
  )
}

export default TopicCreate
