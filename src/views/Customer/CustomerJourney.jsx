import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
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
  cilArrowTop,
  cilArrowBottom,
  cilSwapVertical,
} from '@coreui/icons'

const CustomerJourney = () => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  // Fetch customer analytics data
  const fetchAnalyticsData = async (
    page = 1,
    per_page = 10,
    order_by = '',
    order_by_direction = 'desc',
  ) => {
    try {
      setLoading(true)
      const params = {
        page: page,
        per_page: per_page,
      }

      // Add sorting parameters if provided
      if (order_by) {
        params.order_by = order_by
        params.order_by_direction = order_by_direction
      }
      console.log('Params', params)

      const response = await axios.get(`customer/analytics/all`, {
        params: params,
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
    fetchAnalyticsData(currentPage, perPage, sortBy, sortDirection)
  }, [currentPage, perPage, sortBy, sortDirection])

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
  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer)
    setModalVisible(true)
    setModalLoading(true)
    setSelectedCustomerDetails(null)

    try {
      const response = await axios.get(`customer/analytics/details/${customer.user_id}`)

      if (response.data.message === 'Customer details retrieved successfully') {
        setSelectedCustomerDetails(response.data.data)
      } else {
        toast.error('Failed to fetch customer details')
      }
    } catch (err) {
      console.error('Error fetching customer details:', err)
      toast.error('Error fetching customer details: ' + err.message)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle closing modal
  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedCustomer(null)
    setSelectedCustomerDetails(null)
    setModalLoading(false)
  }

  // Handle column sorting
  const handleSort = (column) => {
    const sortableColumns = [
      'session_count',
      'total_screens_visited',
      'total_session_duration',
      'last_visit',
      'user_id',
    ]

    if (!sortableColumns.includes(column)) {
      return
    }

    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column with ascending order
      setSortBy(column)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  // Get sort icon for column
  const getSortIcon = (column) => {
    const sortableColumns = [
      'session_count',
      'total_screens_visited',
      'total_session_duration',
      'last_visit',
      'user_id',
    ]

    if (!sortableColumns.includes(column)) {
      return null
    }

    if (sortBy === column) {
      return sortDirection === 'asc' ? cilArrowTop : cilArrowBottom
    }

    // Show both-way icon for sortable columns by default
    return cilSwapVertical
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
            <CButton
              color="primary"
              onClick={() => fetchAnalyticsData(currentPage, perPage, sortBy, sortDirection)}
            >
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
                  onClick={() => fetchAnalyticsData(currentPage, perPage, sortBy, sortDirection)}
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
                    <CTableHeaderCell
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('user_id')}
                    >
                      <div className="d-flex align-items-center">
                        Customer
                        <CIcon icon={getSortIcon('user_id')} className="ms-1" size="sm" />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('session_count')}
                    >
                      <div className="d-flex align-items-center">
                        Sessions
                        <CIcon icon={getSortIcon('session_count')} className="ms-1" size="sm" />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('total_screens_visited')}
                    >
                      <div className="d-flex align-items-center">
                        Screens Visited
                        <CIcon
                          icon={getSortIcon('total_screens_visited')}
                          className="ms-1"
                          size="sm"
                        />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('total_session_duration')}
                    >
                      <div className="d-flex align-items-center">
                        Total Duration
                        <CIcon
                          icon={getSortIcon('total_session_duration')}
                          className="ms-1"
                          size="sm"
                        />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell>Avg Session</CTableHeaderCell>
                    <CTableHeaderCell>Engagement</CTableHeaderCell>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('last_visit')}
                    >
                      <div className="d-flex align-items-center">
                        Last Visit
                        <CIcon icon={getSortIcon('last_visit')} className="ms-1" size="sm" />
                      </div>
                    </CTableHeaderCell>
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
      <CModal visible={modalVisible} onClose={handleCloseModal} size="xl">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilUser} className="me-2" />
            Customer Analytics Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <div className="mt-2">Loading customer details...</div>
            </div>
          ) : selectedCustomerDetails ? (
            <div>
              {/* Customer Header */}
              <CRow className="mb-4">
                <CCol>
                  <CCard>
                    <CCardBody>
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg me-3">
                          {selectedCustomerDetails.customer.customer_profilepic ? (
                            <img
                              src={selectedCustomerDetails.customer.customer_profilepic}
                              alt={selectedCustomerDetails.customer.customer_fname}
                              className="avatar-img rounded-circle"
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                border: '3px solid #e4e4e7',
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className="avatar-initial rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{
                              display: selectedCustomerDetails.customer.customer_profilepic
                                ? 'none'
                                : 'flex',
                              width: '80px',
                              height: '80px',
                              fontSize: '32px',
                              fontWeight: '600',
                            }}
                          >
                            {selectedCustomerDetails.customer.customer_fname.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h3 className="mb-1">
                            {selectedCustomerDetails.customer.customer_fname}
                          </h3>
                          <div className="text-muted mb-2">
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilUser} className="me-2" />
                              <span>
                                Customer ID: {selectedCustomerDetails.customer.customer_id}
                              </span>
                            </div>
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilEnvelopeClosed} className="me-2" />
                              <span>{selectedCustomerDetails.customer.customer_email}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <CIcon icon={cilCalendar} className="me-2" />
                              <span>
                                Contact: {selectedCustomerDetails.customer.contact_number}
                              </span>
                            </div>
                          </div>
                          <CBadge
                            color={
                              selectedCustomerDetails.customer.customer_status === 'Active'
                                ? 'success'
                                : 'danger'
                            }
                            shape="rounded-pill"
                          >
                            {selectedCustomerDetails.customer.customer_status}
                          </CBadge>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Analytics Overview Cards */}
              <CRow className="mb-4">
                <CCol md={3}>
                  <CCard className="text-center h-100 border-start border-primary border-3">
                    <CCardBody>
                      <CIcon icon={cilScreenDesktop} size="xl" className="text-primary mb-2" />
                      <div className="fs-3 fw-bold text-primary">
                        {selectedCustomerDetails.stats.session_count}
                      </div>
                      <div className="text-muted">Total Sessions</div>
                      <small className="text-success">
                        Avg: {selectedCustomerDetails.stats.avg_screens_per_session} screens/session
                      </small>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="text-center h-100 border-start border-success border-3">
                    <CCardBody>
                      <CIcon icon={cilScreenDesktop} size="xl" className="text-success mb-2" />
                      <div className="fs-3 fw-bold text-success">
                        {selectedCustomerDetails.stats.total_screens_visited}
                      </div>
                      <div className="text-muted">Screens Visited</div>
                      <small className="text-info">
                        {Math.round(
                          selectedCustomerDetails.stats.total_screens_visited /
                            selectedCustomerDetails.stats.session_count,
                        )}{' '}
                        per session
                      </small>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="text-center h-100 border-start border-warning border-3">
                    <CCardBody>
                      <CIcon icon={cilClock} size="xl" className="text-warning mb-2" />
                      <div className="fs-3 fw-bold text-warning">
                        {formatDuration(selectedCustomerDetails.stats.total_session_duration)}
                      </div>
                      <div className="text-muted">Total Duration</div>
                      <small className="text-primary">
                        Avg: {formatDuration(selectedCustomerDetails.stats.avg_session_duration)}
                      </small>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="text-center h-100 border-start border-info border-3">
                    <CCardBody>
                      <CIcon icon={cilCalendar} size="xl" className="text-info mb-2" />
                      <div className="fs-6 fw-bold text-info">
                        {new Date(selectedCustomerDetails.stats.first_visit).toLocaleDateString()}
                      </div>
                      <div className="text-muted">First Visit</div>
                      <small className="text-muted">
                        Last:{' '}
                        {new Date(selectedCustomerDetails.stats.last_visit).toLocaleDateString()}
                      </small>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Devices and Routes Section */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <CCard className="h-100">
                    <CCardHeader className="bg-light">
                      <h5 className="mb-0">
                        <CIcon icon={cilScreenDesktop} className="me-2" />
                        Device Information
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      {selectedCustomerDetails.devices.map((device, index) => (
                        <div key={index} className="border rounded p-3 mb-3 bg-light">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{device.model}</h6>
                            <CBadge color="info" shape="rounded-pill">
                              {device.sessions_count} sessions
                            </CBadge>
                          </div>
                          <div className="row text-sm">
                            <div className="col-6">
                              <strong>Brand:</strong> {device.brand}
                            </div>
                            <div className="col-6">
                              <strong>OS:</strong> {device.system_name} {device.system_version}
                            </div>
                            <div className="col-6">
                              <strong>Device ID:</strong> {device.device_id}
                            </div>
                            <div className="col-6">
                              <strong>Build:</strong> {device.build_number}
                            </div>
                          </div>
                          <div className="mt-2 text-muted small">
                            <div>First seen: {new Date(device.first_seen).toLocaleString()}</div>
                            <div>Last seen: {new Date(device.last_seen).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard className="h-100">
                    <CCardHeader className="bg-light">
                      <h5 className="mb-0">
                        <CIcon icon={cilChartPie} className="me-2" />
                        Route Analytics
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      {selectedCustomerDetails.routes.map((route, index) => (
                        <div key={index} className="border rounded p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 text-primary">{route.route_name}</h6>
                            <CBadge color="primary" shape="rounded-pill">
                              {route.total_visits} visits
                            </CBadge>
                          </div>
                          <div className="row text-sm">
                            <div className="col-6">
                              <strong>Total Duration:</strong>{' '}
                              {formatDuration(route.total_duration)}
                            </div>
                            <div className="col-6">
                              <strong>Avg Duration:</strong>{' '}
                              {formatDuration(route.average_duration)}
                            </div>
                            <div className="col-12 mt-1">
                              <strong>Sessions:</strong> {route.sessions_count}
                            </div>
                          </div>
                          <div className="mt-2">
                            <CProgress height={6}>
                              <CProgressBar
                                color="primary"
                                value={
                                  (route.total_visits /
                                    selectedCustomerDetails.stats.total_screens_visited) *
                                  100
                                }
                              />
                            </CProgress>
                            <small className="text-muted">
                              {Math.round(
                                (route.total_visits /
                                  selectedCustomerDetails.stats.total_screens_visited) *
                                  100,
                              )}
                              % of total visits
                            </small>
                          </div>
                        </div>
                      ))}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Sessions Detail */}
              <CRow>
                <CCol>
                  <CCard>
                    <CCardHeader className="bg-light">
                      <h5 className="mb-0">
                        <CIcon icon={cilClock} className="me-2" />
                        Session History
                      </h5>
                    </CCardHeader>
                    <CCardBody className="p-0">
                      <CTable hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Session Date</CTableHeaderCell>
                            <CTableHeaderCell>Device</CTableHeaderCell>
                            <CTableHeaderCell>Screens Visited</CTableHeaderCell>
                            <CTableHeaderCell>Duration</CTableHeaderCell>
                            <CTableHeaderCell>Routes</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {selectedCustomerDetails.sessions.map((session, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>
                                <div>
                                  <strong>
                                    {new Date(session.created_at).toLocaleDateString()}
                                  </strong>
                                </div>
                                <small className="text-muted">
                                  {new Date(session.created_at).toLocaleTimeString()}
                                </small>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div>
                                  <strong>
                                    {session.device.brand} {session.device.model}
                                  </strong>
                                </div>
                                <small className="text-muted">
                                  {session.device.system_name} {session.device.system_version}
                                </small>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="info" shape="rounded-pill">
                                  {session.total_screens_visited}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <span className="fw-semibold">
                                  {formatDuration(session.total_session_duration)}
                                </span>
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="d-flex flex-wrap gap-1">
                                  {session.routes.map((route, routeIndex) => (
                                    <CBadge
                                      key={routeIndex}
                                      color="outline-primary"
                                      className="me-1 mb-1"
                                    >
                                      {route.route_name} ({route.visits})
                                    </CBadge>
                                  ))}
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Customer Information */}
              <CRow className="mt-4">
                <CCol>
                  <CCard>
                    <CCardHeader className="bg-light">
                      <h5 className="mb-0">
                        <CIcon icon={cilUser} className="me-2" />
                        Customer Information
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={6}>
                          <div className="mb-3">
                            <strong>Full Name:</strong>
                            <div className="text-muted">
                              {selectedCustomerDetails.customer.customer_fname}
                            </div>
                          </div>
                          <div className="mb-3">
                            <strong>Email:</strong>
                            <div className="text-muted">
                              {selectedCustomerDetails.customer.customer_email}
                            </div>
                          </div>
                          <div className="mb-3">
                            <strong>Contact Number:</strong>
                            <div className="text-muted">
                              {selectedCustomerDetails.customer.contact_number}
                            </div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="mb-3">
                            <strong>Nationality:</strong>
                            <div className="text-muted">
                              {selectedCustomerDetails.customer.customer_nationality}
                            </div>
                          </div>
                          <div className="mb-3">
                            <strong>Address:</strong>
                            <div className="text-muted">
                              {selectedCustomerDetails.customer.customer_address}
                            </div>
                          </div>
                          <div className="mb-3">
                            <strong>Account Created:</strong>
                            <div className="text-muted">
                              {new Date(
                                selectedCustomerDetails.customer.created_at,
                              ).toLocaleString()}
                            </div>
                          </div>
                          <div className="mb-3">
                            <strong>Last Updated:</strong>
                            <div className="text-muted">
                              {new Date(
                                selectedCustomerDetails.customer.updated_at,
                              ).toLocaleString()}
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          ) : (
            <div className="text-center py-5">
              <CAlert color="warning">No detailed information available for this customer.</CAlert>
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
