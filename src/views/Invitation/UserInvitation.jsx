import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CImage,
} from '@coreui/react'
import axios from 'axios'

const UserInvitation = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    contact: '',
    office_address: '',
    email: '',
    whatsapp: '',
    photo: null,
    info: '',
  })

  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required'
    if (!formData.office_address.trim()) newErrors.office_address = 'Office address is required'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) newErrors.email = 'Valid email is required'

    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required'
    if (!formData.photo) newErrors.photo = 'Photo is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: 'File size should be less than 2MB',
        }))
        return
      }

      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Please upload a valid image file (JPEG, PNG, JPG, GIF)',
        }))
        return
      }

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    const formPayload = new FormData()
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key])
    })

    try {
      const response = await axios.post('/api/user-invitation', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setSubmissionResult({
          ...response.data.user,
          qrCodeUrl: response.data.qrCodeUrl // Add this line to handle QR code URL
        });
      } else {
        throw new Error(response.data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error)
      
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {})
        } else {
          setErrors((prev) => ({
            ...prev,
            submit: error.response.data.message || 'Server error occurred',
          }))
        }
      } else if (error.request) {
        setErrors((prev) => ({
          ...prev,
          submit: 'Network error. Please check your connection.',
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || 'An unexpected error occurred',
        }))
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="container-lg">
      {!submissionResult ? (
        <CCard className="mb-4">
          <CCardHeader>
            <h4 className="mb-0">User Invitation Form</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-4">
                <CCol md={6}>
                  <div>
                    <CFormLabel>Name</CFormLabel>
                    <CFormInput
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      invalid={!!errors.name}
                      feedback={errors.name}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Designation</CFormLabel>
                    <CFormInput
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      invalid={!!errors.designation}
                      feedback={errors.designation}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Contact</CFormLabel>
                    <CFormInput
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      invalid={!!errors.contact}
                      feedback={errors.contact}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Office Address</CFormLabel>
                    <CFormInput
                      type="text"
                      name="office_address"
                      value={formData.office_address}
                      onChange={handleInputChange}
                      invalid={!!errors.office_address}
                      feedback={errors.office_address}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      invalid={!!errors.email}
                      feedback={errors.email}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>WhatsApp</CFormLabel>
                    <CFormInput
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      invalid={!!errors.whatsapp}
                      feedback={errors.whatsapp}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Photo</CFormLabel>
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <CButton component="label" color="primary">
                          Upload Photo
                          <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                        </CButton>
                        {errors.photo && (
                          <div className="text-danger small mt-1">{errors.photo}</div>
                        )}
                      </div>
                      {preview && (
                        <CImage
                          rounded
                          thumbnail
                          src={preview}
                          width={64}
                          height={64}
                          alt="Preview"
                        />
                      )}
                    </div>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Additional Info</CFormLabel>
                    <CFormTextarea
                      name="info"
                      value={formData.info}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </CCol>
              </CRow>

              {errors.submit && (
                <CAlert color="danger" className="mt-3">
                  {errors.submit}
                </CAlert>
              )}

              <div className="mt-4">
                <CButton type="submit" color="primary" disabled={loading} className="w-100">
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Invitation'
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      ) : (
        <CCard>
        <CCardHeader>
          <h4 className="mb-0">Invitation Created Successfully!</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <h5 className="mb-3">User Details</h5>
              <div className="mb-2">
                <strong>Name:</strong> {submissionResult.name}
              </div>
              <div className="mb-2">
                <strong>Designation:</strong> {submissionResult.designation}
              </div>
              <div className="mb-2">
                <strong>Contact:</strong> {submissionResult.contact}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> {submissionResult.email}
              </div>
              <div className="mb-2">
                <strong>WhatsApp:</strong> {submissionResult.whatsapp}
              </div>
              <div className="mb-2">
                <strong>Office Address:</strong> {submissionResult.office_address}
              </div>
            </CCol>
            <CCol md={6} className="text-center">
              <h5 className="mb-3">QR Code</h5>
              {submissionResult.qrCodeUrl && (
                <>
                  <CImage
                    src={submissionResult.qrCodeUrl}
                    alt="QR Code"
                    className="mw-100 h-auto mb-3"
                  />
                  <div>
                    <CButton 
                      color="primary"
                      href={submissionResult.qrCodeUrl}
                      download="qr-code.svg"
                    >
                      Download QR Code
                    </CButton>
                  </div>
                  <p className="text-muted small mt-2">Scan to view details</p>
                </>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    )}
  </div>
)
}

export default UserInvitation