import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CAvatar,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheckCircle,
  cilXCircle,
  cilUser,
  cilDevices,
  cilCalendar,
  cilBell,
  cilInfo,
  cilTag,
  cilClock,
  cilChart,
} from '@coreui/icons'

function NotificationList(props) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [topicModalVisible, setTopicModalVisible] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)

  const fetchNotifications = async (props) => {
    setLoading(true)
    try {
      const response = await axios.get('/promotions/notifications/paginate', {
        params: { page, per_page: perPage },
      })

      const { data, last_page } = response.data.notifications
      setNotifications(data)
      setTotalPages(last_page || 1)
    } catch (error) {
      console.log('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [page, perPage, props.isNotificationCreated])

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <CBadge color="success">Success</CBadge>
    ) : (
      <CBadge color="danger">Failed</CBadge>
    )
  }

  const openTopicModal = (topic) => {
    console.log(topic)
    setSelectedTopic(topic)
    setTopicModalVisible(true)
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white">
          <strong>📢 Notification Sending History</strong>
          <CFormSelect
            size="sm"
            style={{ width: 'auto', backgroundColor: 'white' }}
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value))
              setPage(1) // reset to first page when perPage changes
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </CFormSelect>
        </CCardHeader>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" size="lg" />
            <p className="mt-3 text-muted">Loading notifications...</p>
          </div>
        ) : (
          <>
            <div className="m-4">
              {notifications.map((item) => (
                <CCard
                  key={item.id}
                  className="mb-3 shadow-sm"
                  style={{
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid #e6e6e6',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    borderLeft: item.is_success === 1 ? '6px solid #10b981' : '6px solid #ef4444',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <CCardBody className="p-3">
                    <CRow className="align-items-start">
                      {/* Left Section - ID and Title */}
                      <CCol md={3} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="badge bg-light text-primary me-2 px-3 py-2"
                            style={{ borderRadius: '8px', fontWeight: '600' }}
                          >
                            #{item.id}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          {item.image ? (
                            <CAvatar
                              src={item.image}
                              size="lg"
                              className="me-3 border border-2 border-light shadow-sm"
                              style={{ borderRadius: '12px' }}
                            />
                          ) : (
                            <div
                              className="me-3 d-flex align-items-center justify-content-center border border-2 border-light shadow-sm"
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#f8fafc',
                                color: '#64748b',
                              }}
                            >
                              <CIcon icon={cilBell} size="lg" />
                            </div>
                          )}
                          <div>
                            <h6
                              className="mb-1 fw-bold d-flex align-items-center"
                              style={{ fontSize: '1.1rem', color: '#1e293b' }}
                            >
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  display: 'inline-block',
                                  marginRight: '8px',
                                  background: item.is_success === 1 ? '#10b981' : '#ef4444',
                                  boxShadow: '0 0 8px rgba(0,0,0,0.06)',
                                }}
                              />
                              {item.title}
                            </h6>
                            <small className="text-muted">
                              <CIcon icon={cilClock} size="sm" className="me-1" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </CCol>
                      {/* Middle Section - Content and Topic */}
                      <CCol md={4} className="mb-3 mb-md-0">
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilInfo} size="sm" className="me-2 text-muted" />
                            <small className="text-muted fw-medium">Content</small>
                          </div>
                          <p
                            className="mb-0 text-dark"
                            style={{
                              maxWidth: '280px',
                              lineHeight: '1.5',
                              fontSize: '0.95rem',
                            }}
                          >
                            {item.content || 'No content provided'}
                          </p>
                        </div>
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilTag} size="sm" className="me-2 text-muted" />
                            <small className="text-muted fw-medium">Topic</small>
                          </div>
                          <span
                            className="badge bg-info text-white px-3 py-2"
                            title={item.topic?.description}
                            role="button"
                            tabIndex={0}
                            onClick={() => openTopicModal(item.topic)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') openTopicModal(item.topic)
                            }}
                            style={{
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#0ea5e9'
                              e.target.style.transform = 'scale(1.02)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#0891b2'
                              e.target.style.transform = 'scale(1)'
                            }}
                          >
                            {item.topic?.topic || 'No topic'}
                          </span>
                        </div>
                      </CCol>

                      {/* Right Section - Statistics */}
                      <CCol md={3} className="mb-3 mb-md-0">
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="p-3 bg-light rounded-3">
                              <div className="d-flex align-items-center mb-1">
                                <CIcon icon={cilUser} size="sm" className="me-2 text-primary" />
                                <small className="text-muted fw-medium">Users</small>
                              </div>
                              <span className="fw-bold fs-6 text-dark">
                                {item.total_users?.toLocaleString() || '0'}
                              </span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-3 bg-light rounded-3">
                              <div className="d-flex align-items-center mb-1">
                                <CIcon icon={cilDevices} size="sm" className="me-2 text-primary" />
                                <small className="text-muted fw-medium">Devices</small>
                              </div>
                              <span className="fw-bold fs-6 text-dark">
                                {item.total_devices?.toLocaleString() || '0'}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
                              <div className="d-flex align-items-center mb-1">
                                <CIcon icon={cilChart} size="sm" className="me-2 text-success" />
                                <small className="text-success fw-medium">
                                  Push Notification Success Rate
                                </small>
                              </div>
                              <div className="d-flex align-items-center">
                                <span className="fw-bold text-success me-2">
                                  {item.successful_devices?.toLocaleString() || '0'}
                                </span>
                                <small className="text-muted">
                                  / {item.total_devices?.toLocaleString() || '0'}
                                </small>
                                <small className="ms-auto text-success fw-medium">
                                  {item.total_devices > 0
                                    ? `${Math.round(
                                        (item.successful_devices / item.total_devices) * 100,
                                      )}%`
                                    : '0%'}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CCol>

                      {/* Far Right Section - Status and Date */}
                      <CCol md={2}>
                        <div className="text-center">
                          <div className="mb-2">
                            <small className="text-muted d-block">Sent At</small>
                            <small className="fw-bold d-block text-dark">
                              {new Date(item.created_at).toLocaleDateString()}
                            </small>
                            <small className="text-muted">
                              {new Date(item.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </small>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">Topic Status</small>
                            {item.is_sent_to_topic === 1 ? (
                              <CBadge color="success">Sent</CBadge>
                            ) : (
                              <CBadge color="danger">Failed</CBadge>
                            )}
                          </div>
                          <div>
                            <small className="text-muted d-block">Push Status</small>
                            {item.is_success === 1 ? (
                              <CBadge color="success">Success</CBadge>
                            ) : (
                              <CBadge color="danger">Failed</CBadge>
                            )}
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              ))}
            </div>

            {/* Empty State */}
            {notifications.length === 0 && (
              <CCard
                className="text-center py-5 m-4"
                style={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }}
              >
                <CCardBody>
                  <h5 className="text-muted">No notifications found</h5>
                  <p className="text-muted">There are no notification records to display.</p>
                </CCardBody>
              </CCard>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <CPagination align="center">
                  <CPaginationItem
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 7) {
                      pageNum = i + 1
                    } else {
                      if (page <= 4) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 6 + i
                      } else {
                        pageNum = page - 3 + i
                      }
                    }
                    return (
                      <CPaginationItem
                        key={pageNum}
                        active={page === pageNum}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </CPaginationItem>
                    )
                  })}
                  <CPaginationItem
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
            {/* Topic Details Modal */}
            <CModal
              visible={topicModalVisible}
              onClose={() => setTopicModalVisible(false)}
              backdrop="static"
              keyboard={false}
              size="lg"
              className="modal-modern"
            >
              <CModalHeader onClose={() => setTopicModalVisible(false)} className="border-0 pb-0">
                <CModalTitle className="d-flex align-items-center">
                  <CIcon icon={cilTag} size="lg" className="me-2" />
                  Topic Details
                </CModalTitle>
              </CModalHeader>
              <CModalBody className="p-4">
                {selectedTopic ? (
                  <div className="row g-4">
                    {/* Basic Information */}
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h6 className="card-title mb-3 text-primary">
                            <CIcon icon={cilInfo} className="me-2" />
                            Basic Information
                          </h6>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex flex-column">
                                <small className="text-muted fw-medium mb-1">Topic Name</small>
                                <span className="fw-bold">{selectedTopic.topic}</span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex flex-column">
                                <small className="text-muted fw-medium mb-1">Type</small>
                                <CBadge color="info" className="align-self-start px-2 py-1">
                                  {selectedTopic.type || 'Unknown'}
                                </CBadge>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex flex-column">
                                <small className="text-muted fw-medium mb-1">Description</small>
                                <span className="text-dark">
                                  {selectedTopic.description || 'No description provided'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h6 className="card-title mb-3 text-success">
                            <CIcon icon={cilChart} className="me-2" />
                            Statistics
                          </h6>
                          <div className="row g-3">
                            <div className="col-md-3">
                              <div className="text-center p-3 bg-white rounded-3 border">
                                <CIcon icon={cilUser} size="xl" className="text-primary mb-2" />
                                <div className="fw-bold fs-5 text-dark">
                                  {selectedTopic.total_users != null
                                    ? Number(selectedTopic.total_users).toLocaleString()
                                    : '0'}
                                </div>
                                <small className="text-muted">Total Users</small>
                              </div>
                            </div>
                            {/* <div className="col-md-3">
                              <div className="text-center p-3 bg-white rounded-3 border">
                                <CIcon
                                  icon={cilCheckCircle}
                                  size="xl"
                                  className="text-success mb-2"
                                />
                                <div className="fw-bold fs-5 text-dark">
                                  {selectedTopic.success_users != null
                                    ? Number(selectedTopic.success_users).toLocaleString()
                                    : '0'}
                                </div>
                                <small className="text-muted">Success Users</small>
                              </div>
                            </div> */}
                            <div className="col-md-3">
                              <div className="text-center p-3 bg-white rounded-3 border">
                                <CIcon icon={cilDevices} size="xl" className="text-info mb-2" />
                                <div className="fw-bold fs-5 text-dark">
                                  {selectedTopic.total_devices != null
                                    ? Number(selectedTopic.total_devices).toLocaleString()
                                    : '0'}
                                </div>
                                <small className="text-muted">Total Devices</small>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="text-center p-3 bg-white rounded-3 border">
                                <CIcon
                                  icon={cilCheckCircle}
                                  size="xl"
                                  className="text-success mb-2"
                                />
                                <div className="fw-bold fs-5 text-dark">
                                  {selectedTopic.success_devices != null
                                    ? Number(selectedTopic.success_devices).toLocaleString()
                                    : '0'}
                                </div>
                                <small className="text-muted">Success Devices</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Timestamps */}
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h6 className="card-title mb-3 text-warning">
                            <CIcon icon={cilClock} className="me-2" />
                            Status & Timeline
                          </h6>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <div className="d-flex flex-column">
                                <small className="text-muted fw-medium mb-1">Status</small>
                                <CBadge
                                  color={
                                    selectedTopic.status === 'active' ? 'success' : 'secondary'
                                  }
                                  className="align-self-start px-2 py-1"
                                >
                                  {selectedTopic.status || 'Unknown'}
                                </CBadge>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex flex-column">
                                <small className="text-muted fw-medium mb-1">Created At</small>
                                <span className="fw-medium">
                                  {selectedTopic.created_at
                                    ? new Date(selectedTopic.created_at).toLocaleString()
                                    : 'Unknown'}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex flex-column">
                                <small className="text-muted fw-medium mb-1">Updated At</small>
                                <span className="fw-medium">
                                  {selectedTopic.updated_at
                                    ? new Date(selectedTopic.updated_at).toLocaleString()
                                    : 'Never'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <CIcon icon={cilInfo} size="3xl" className="text-muted mb-3" />
                    <h5 className="text-muted">No topic data available</h5>
                    <p className="text-muted">
                      The selected topic information could not be loaded.
                    </p>
                  </div>
                )}
              </CModalBody>
              <CModalFooter className="border-0 pt-0">
                <CButton
                  color="secondary"
                  onClick={() => setTopicModalVisible(false)}
                  className="px-4"
                  style={{ borderRadius: '8px' }}
                >
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          </>
        )}
      </CCard>
    </div>
  )
}

export default NotificationList
