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
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle, cilUser, cilDevices, cilCalendar } from '@coreui/icons'

function NotificationList(props) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

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

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white">
          <strong>📢 Notification Sending History</strong>
          <CFormSelect
            size="sm"
            style={{ width: 'auto' }}
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
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                >
                  <CCardBody className="p-4">
                    <CRow className="align-items-start">
                      {/* Left Section - ID and Title */}
                      <CCol md={3} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-light text-dark me-2">#{item.id}</span>
                          <small className="text-muted">ID</small>
                        </div>
                        <div className="d-flex align-items-center">
                          {item.image ? (
                            <CAvatar src={item.image} size="md" className="me-2" />
                          ) : null}
                          <div>
                            <h6 className="mb-0 fw-bold">{item.title}</h6>
                          </div>
                        </div>
                      </CCol>

                      {/* Middle Section - Content and Topic */}
                      <CCol md={4} className="mb-3 mb-md-0">
                        <div className="mb-2">
                          <small className="text-muted d-block">Content</small>
                          <p className="mb-0 text-truncate" style={{ maxWidth: '250px' }}>
                            {item.content || '-'}
                          </p>
                        </div>
                        <div>
                          <small className="text-muted d-block">Topic</small>
                          <span className="badge bg-info text-dark" title={item.topic.description}>
                            {item.topic.topic}
                          </span>
                        </div>
                      </CCol>

                      {/* Right Section - Statistics */}
                      <CCol md={3} className="mb-3 mb-md-0">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted d-block">
                              <CIcon icon={cilUser} size="sm" className="me-1" />
                              Users
                            </small>
                            <span className="fw-bold">{item.total_users.toLocaleString()}</span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">
                              <CIcon icon={cilDevices} size="sm" className="me-1" />
                              Devices
                            </small>
                            <span className="fw-bold">
                              {item.topic.total_devices.toLocaleString()}
                            </span>
                          </div>
                          <div className="col-12">
                            <small className="text-muted d-block">Success Rate</small>
                            <span className="fw-bold text-success">
                              {item.topic.success_devices.toLocaleString()}
                            </span>
                            <small className="text-muted">
                              {' '}
                              / {item.topic.total_devices.toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </CCol>

                      {/* Far Right Section - Status and Date */}
                      <CCol md={2}>
                        <div className="text-center">
                          <div className="mb-2">
                            <small className="text-muted d-block">Push Status</small>
                            {getStatusBadge(item.is_success)}
                          </div>
                          <div className="mb-3">
                            <small className="text-muted d-block">Send Status</small>
                            {getStatusBadge(item.is_sent_to_topic)}
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              <CIcon icon={cilCalendar} size="sm" className="me-1" />
                              Sent At
                            </small>
                            <small className="fw-bold">
                              {new Date(item.created_at).toLocaleDateString()}
                            </small>
                            <br />
                            <small className="text-muted">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </small>
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
                className="text-center py-5"
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
          </>
        )}
      </CCard>
    </div>
  )
}

export default NotificationList
