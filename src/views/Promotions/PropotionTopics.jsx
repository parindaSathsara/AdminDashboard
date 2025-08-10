import React, { useState } from 'react'
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

function PropotionTopics() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    type: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleClear = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      type: '',
    })
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h3 className="fw-bold mb-2">Create New Topic</h3>
        <p className="text-muted mb-4">Fill out the details to add a new promotion topic.</p>

        <CForm onSubmit={handleSubmit}>
          <CRow>
            {/* Name */}
            <CCol md={6} className="mb-3">
              <CFormInput
                type="text"
                name="name"
                label="Topic Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </CCol>

            {/* Notification Title */}
            <CCol md={6} className="mb-3">
              <CFormInput
                type="text"
                name="title"
                label="Notification Title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                required
              />
            </CCol>
          </CRow>

          {/* Description */}
          <CRow>
            <CCol className="mb-3">
              <CFormTextarea
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description"
                rows={4}
                required
              />
            </CCol>
          </CRow>

          {/* Notification Type */}
          <CRow>
            <CCol md={6} className="mb-4">
              <CFormSelect
                name="type"
                label="Notification Type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="all_users">All users</option>
                <option value="order_placed_users">Order placed users</option>
                <option value="order_not_placed_users">Order not placed users</option>
                <option value="users_with_products_in_carts">Users with products in carts</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-end">
            <CButton color="secondary" variant="outline" type="button" onClick={handleClear}>
              Clear
            </CButton>
            <CButton color="primary" type="submit">
              Subscribe
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default PropotionTopics
