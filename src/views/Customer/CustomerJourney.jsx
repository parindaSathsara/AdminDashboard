import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CProgress,
  CProgressBar,
  CButton,
  CButtonGroup,
  CPagination,
  CPaginationItem,
  CSpinner,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import {
  cilUser,
  cilClock,
  cilScreenDesktop,
  cilCalendar,
  cilReload,
  cilSettings,
  cilChartPie,
  cilEnvelopeClosed,
  cilX,
} from '@coreui/icons'

const CustomerJourney = () => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Fetch customer analytics data
  const fetchAnalyticsData = async (page = 1, per_page = 10) => {
    try {
      setLoading(true)
      const response = await axios.get(`customer/analytics/all`, {
        params: {
          page: page,
          per_page: per_page,
        },
      })

      if (response.data.message === 'Customer analytics data retrieved successfully') {
        setAnalyticsData(response.data.data)
        setCurrentPage(response.data.data.current_page)
      } else {
        setError('Failed to fetch analytics data')
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData(currentPage, perPage)
  }, [currentPage, perPage])

  // Format duration to human readable format
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Get engagement level based on session data
  const getEngagementLevel = (sessionCount, totalDuration) => {
    const avgSessionDuration = totalDuration / sessionCount

    if (sessionCount >= 5 && avgSessionDuration >= 200) {
      return { level: 'High', color: 'success', percentage: 85 }
    } else if (sessionCount >= 3 && avgSessionDuration >= 100) {
      return { level: 'Medium', color: 'warning', percentage: 60 }
    } else {
      return { level: 'Low', color: 'danger', percentage: 30 }
    }
  }

  // Calculate time since last visit
  const getTimeSinceLastVisit = (lastVisit) => {
    const lastVisitDate = new Date(lastVisit)
    const now = new Date()
    const diffTime = Math.abs(now - lastVisitDate)
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day(s) ago`
    } else {
      return `${diffHours} hour(s) ago`
    }
  }

  // Handle pagination
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  // Handle per page change
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  // Handle viewing customer details
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setModalVisible(true)
  }

  // Handle closing modal
  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedCustomer(null)
  }

  if (loading) {
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardBody className="text-center">
              <CSpinner color="primary" />
              <div className="mt-2">Loading customer analytics...</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  if (error) {
    return (
      <CRow>
        <CCol>
          <CAlert color="danger">
            <h4>Error</h4>
            <p>{error}</p>
            <CButton color="primary" onClick={() => fetchAnalyticsData(currentPage, perPage)}>
              <CIcon icon={cilReload} className="me-2" />
              Retry
            </CButton>
          </CAlert>
        </CCol>
      </CRow>
    )
  }

  return (
    <div>
      {/* Header Section */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  <CIcon icon={cilChartPie} className="me-2" />
                  Customer Journey Analytics
                </h4>
                <small className="text-muted">
                  Track customer engagement and behavior patterns
                </small>
              </div>
              <div className="d-flex gap-2">
                <CDropdown>
                  <CDropdownToggle color="outline-secondary" size="sm">
                    <CIcon icon={cilSettings} className="me-1" />
                    Per Page: {perPage}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => handlePerPageChange(5)}>5</CDropdownItem>
                    <CDropdownItem onClick={() => handlePerPageChange(10)}>10</CDropdownItem>
                    <CDropdownItem onClick={() => handlePerPageChange(25)}>25</CDropdownItem>
                    <CDropdownItem onClick={() => handlePerPageChange(50)}>50</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <CButton
                  color="primary"
                  size="sm"
                  onClick={() => fetchAnalyticsData(currentPage, perPage)}
                >
                  <CIcon icon={cilReload} className="me-1" />
                  Refresh
                </CButton>
              </div>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>

      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <div className="fs-4 fw-semibold text-primary">{analyticsData?.total || 0}</div>
              <div className="text-muted text-uppercase fw-semibold small">Total Customers</div>
              <CIcon icon={cilUser} size="lg" className="text-primary mt-2" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <div className="fs-4 fw-semibold text-success">
                {analyticsData?.data?.reduce((sum, customer) => sum + customer.session_count, 0) ||
                  0}
              </div>
              <div className="text-muted text-uppercase fw-semibold small">Total Sessions</div>
              <CIcon icon={cilScreenDesktop} size="lg" className="text-success mt-2" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <div className="fs-4 fw-semibold text-warning">
                {analyticsData?.data?.reduce(
                  (sum, customer) => sum + parseInt(customer.total_screens_visited),
                  0,
                ) || 0}
              </div>
              <div className="text-muted text-uppercase fw-semibold small">Screens Visited</div>
              <CIcon icon={cilScreenDesktop} size="lg" className="text-warning mt-2" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <div className="fs-4 fw-semibold text-info">
                {formatDuration(
                  analyticsData?.data?.reduce(
                    (sum, customer) => sum + parseInt(customer.total_session_duration),
                    0,
                  ) || 0,
                )}
              </div>
              <div className="text-muted text-uppercase fw-semibold small">Total Time</div>
              <CIcon icon={cilClock} size="lg" className="text-info mt-2" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Customer Analytics Table */}
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Customer Analytics Details</h5>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell>Sessions</CTableHeaderCell>
                    <CTableHeaderCell>Screens Visited</CTableHeaderCell>
                    <CTableHeaderCell>Total Duration</CTableHeaderCell>
                    <CTableHeaderCell>Avg Session</CTableHeaderCell>
                    <CTableHeaderCell>Engagement</CTableHeaderCell>
                    <CTableHeaderCell>Last Visit</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {analyticsData?.data?.map((customer) => {
                    const engagement = getEngagementLevel(
                      customer.session_count,
                      parseInt(customer.total_session_duration),
                    )
                    const avgSessionDuration = Math.round(
                      parseInt(customer.total_session_duration) / customer.session_count,
                    )

                    return (
                      <CTableRow key={customer.user_id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-md me-3">
                              {customer.profile_picture ? (
                                <img
                                  src={customer.profile_picture}
                                  alt={customer.user_name}
                                  className="avatar-img rounded-circle"
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                    border: '2px solid #e4e4e7',
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div
                                className="avatar-initial rounded-circle bg-primary text-white"
                                style={{
                                  display: customer.profile_picture ? 'none' : 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '40px',
                                  height: '40px',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                }}
                              >
                                {customer.user_name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="fw-semibold">{customer.user_name}</div>
                              <div className="text-muted small">ID: {customer.user_id}</div>
                              {customer.email && (
                                <div className="text-muted small d-flex align-items-center mt-1">
                                  <CIcon icon={cilEnvelopeClosed} size="sm" className="me-1" />
                                  <span className="text-truncate" style={{ maxWidth: '200px' }}>
                                    {customer.email}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info" shape="rounded-pill">
                            {customer.session_count}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-semibold">{customer.total_screens_visited}</span>
                          <div className="text-muted small">
                            {Math.round(customer.total_screens_visited / customer.session_count)}{' '}
                            per session
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-semibold">
                            {formatDuration(parseInt(customer.total_session_duration))}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-semibold">{formatDuration(avgSessionDuration)}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="mb-1">
                            <CBadge color={engagement.color}>{engagement.level}</CBadge>
                          </div>
                          <CProgress height={4}>
                            <CProgressBar color={engagement.color} value={engagement.percentage} />
                          </CProgress>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilCalendar} className="me-1 text-muted" />
                            <div>
                              <div className="small">
                                {new Date(customer.last_visit).toLocaleDateString()}
                              </div>
                              <div className="text-muted smaller">
                                {getTimeSinceLastVisit(customer.last_visit)}
                              </div>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                            title="View Customer Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Pagination */}
      {analyticsData && analyticsData.last_page > 1 && (
        <CRow className="mt-3">
          <CCol>
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {analyticsData.from} to {analyticsData.to} of {analyticsData.total} results
              </div>
              <CPagination>
                <CPaginationItem
                  disabled={!analyticsData.prev_page_url}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>

                {Array.from({ length: analyticsData.last_page }, (_, i) => i + 1).map((page) => (
                  <CPaginationItem
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </CPaginationItem>
                ))}

                <CPaginationItem
                  disabled={!analyticsData.next_page_url}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          </CCol>
        </CRow>
      )}

      {/* Customer Details Modal */}
      <CModal visible={modalVisible} onClose={handleCloseModal} size="lg">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilUser} className="me-2" />
            Customer Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedCustomer && (
            <div>
              {/* Customer Header */}
              <CRow className="mb-4">
                <CCol>
                  <CCard>
                    <CCardBody>
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg me-3">
                          {selectedCustomer.profile_picture ? (
                            <img
                              src={selectedCustomer.profile_picture}
                              alt={selectedCustomer.user_name}
                              className="avatar-img rounded-circle"
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                border: '3px solid #e4e4e7',
                              }}
                            />
                          ) : (
                            <div
                              className="avatar-initial rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                              style={{
                                width: '60px',
                                height: '60px',
                                fontSize: '24px',
                                fontWeight: '600',
                              }}
                            >
                              {selectedCustomer.user_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h4 className="mb-1">{selectedCustomer.user_name}</h4>
                          <div className="text-muted">
                            <div>
                              <CIcon icon={cilUser} className="me-1" />
                              Customer ID: {selectedCustomer.user_id}
                            </div>
                            {selectedCustomer.email && (
                              <div className="mt-1">
                                <CIcon icon={cilEnvelopeClosed} className="me-1" />
                                {selectedCustomer.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Analytics Overview */}
              <CRow className="mb-4">
                <CCol md={3}>
                  <CCard className="text-center h-100">
                    <CCardBody>
                      <CIcon icon={cilScreenDesktop} size="xl" className="text-primary mb-2" />
                      <div className="fs-4 fw-semibold text-primary">
                        {selectedCustomer.session_count}
                      </div>
                      <div className="text-muted small">Total Sessions</div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="text-center h-100">
                    <CCardBody>
                      <CIcon icon={cilScreenDesktop} size="xl" className="text-success mb-2" />
                      <div className="fs-4 fw-semibold text-success">
                        {selectedCustomer.total_screens_visited}
                      </div>
                      <div className="text-muted small">Screens Visited</div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="text-center h-100">
                    <CCardBody>
                      <CIcon icon={cilClock} size="xl" className="text-warning mb-2" />
                      <div className="fs-4 fw-semibold text-warning">
                        {formatDuration(parseInt(selectedCustomer.total_session_duration))}
                      </div>
                      <div className="text-muted small">Total Time</div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="text-center h-100">
                    <CCardBody>
                      <CIcon icon={cilCalendar} size="xl" className="text-info mb-2" />
                      <div className="fs-4 fw-semibold text-info">
                        {formatDuration(
                          Math.round(
                            parseInt(selectedCustomer.total_session_duration) /
                              selectedCustomer.session_count,
                          ),
                        )}
                      </div>
                      <div className="text-muted small">Avg Session</div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Detailed Information */}
              <CRow>
                <CCol md={6}>
                  <CCard>
                    <CCardHeader>
                      <h6 className="mb-0">Session Analytics</h6>
                    </CCardHeader>
                    <CCardBody>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Engagement Level</span>
                          <span>
                            {(() => {
                              const engagement = getEngagementLevel(
                                selectedCustomer.session_count,
                                parseInt(selectedCustomer.total_session_duration),
                              )
                              return <CBadge color={engagement.color}>{engagement.level}</CBadge>
                            })()}
                          </span>
                        </div>
                        <CProgress height={8}>
                          <CProgressBar
                            color={
                              getEngagementLevel(
                                selectedCustomer.session_count,
                                parseInt(selectedCustomer.total_session_duration),
                              ).color
                            }
                            value={
                              getEngagementLevel(
                                selectedCustomer.session_count,
                                parseInt(selectedCustomer.total_session_duration),
                              ).percentage
                            }
                          />
                        </CProgress>
                      </div>
                      <div className="mb-3">
                        <strong>Screens per Session:</strong>
                        <div className="text-muted">
                          {Math.round(
                            selectedCustomer.total_screens_visited / selectedCustomer.session_count,
                          )}{' '}
                          screens on average
                        </div>
                      </div>
                      <div>
                        <strong>Session Frequency:</strong>
                        <div className="text-muted">
                          {selectedCustomer.session_count} sessions total
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={6}>
                  <CCard>
                    <CCardHeader>
                      <h6 className="mb-0">Activity Information</h6>
                    </CCardHeader>
                    <CCardBody>
                      <div className="mb-3">
                        <strong>Last Visit:</strong>
                        <div className="text-muted">
                          {new Date(selectedCustomer.last_visit).toLocaleString()}
                        </div>
                        <div className="text-muted small">
                          {getTimeSinceLastVisit(selectedCustomer.last_visit)}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong>Total Active Time:</strong>
                        <div className="text-muted">
                          {formatDuration(parseInt(selectedCustomer.total_session_duration))}
                        </div>
                      </div>
                      <div>
                        <strong>User Status:</strong>
                        <div className="mt-1">
                          {(() => {
                            const hoursSinceLastVisit =
                              Math.abs(new Date() - new Date(selectedCustomer.last_visit)) /
                              (1000 * 60 * 60)
                            if (hoursSinceLastVisit < 24) {
                              return <CBadge color="success">Recently Active</CBadge>
                            } else if (hoursSinceLastVisit < 168) {
                              // 7 days
                              return <CBadge color="warning">Active This Week</CBadge>
                            } else {
                              return <CBadge color="secondary">Inactive</CBadge>
                            }
                          })()}
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            <CIcon icon={cilX} className="me-1" />
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CustomerJourney
