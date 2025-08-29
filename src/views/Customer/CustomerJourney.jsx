import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './CustomerJourney.css'
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
  const [imageError, setImageError] = useState({})
  const [sortBy, setSortBy] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  // Handle image load error
  const handleImageError = (customerId) => {
    setImageError((prev) => ({
      ...prev,
      [customerId]: true,
    }))
  }

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
    const secs = (seconds % 60).toFixed(2)

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
    setImageError({}) // Reset image errors when modal closes
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
          <CCard className="customer-details-card border-0 shadow-sm">
            <CCardBody className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="rounded-circle bg-primary bg-opacity-10 p-4 mb-3">
                <CSpinner color="primary" />
              </div>
              <h5 className="mb-1">Loading Analytics</h5>
              <div className="text-muted">Please wait while we fetch the customer data...</div>
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
          <CCard className="customer-details-card border-0 shadow-sm">
            <CCardBody className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="rounded-circle bg-danger bg-opacity-10 p-4 mb-3">
                <CIcon icon={cilX} size="xxl" className="text-danger" />
              </div>
              <h5 className="mb-2">Error Loading Data</h5>
              <p className="text-muted text-center mb-4">{error}</p>
              <CButton
                color="primary"
                className="px-4"
                onClick={() => fetchAnalyticsData(currentPage, perPage, sortBy, sortDirection)}
              >
                <CIcon icon={cilReload} className="me-2" />
                Retry
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <div>
      {/* Header Section */}
      <CRow className="mb-4">
        <CCol>
          <CCard className="customer-details-card border-0 shadow-sm">
            <CCardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                    <CIcon icon={cilChartPie} size="xl" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-dark fw-bold">Customer Journey Analytics</h3>
                    <div className="text-muted fs-6">
                      Track customer engagement and behavior patterns across your platform
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-center">
                  <div className="d-flex align-items-center border-end pe-3">
                    <div className="me-2">
                      <div className="text-muted small">Showing</div>
                    </div>
                    <CDropdown>
                      <CDropdownToggle
                        color="light"
                        className="fw-medium d-flex align-items-center"
                      >
                        <CIcon icon={cilSettings} className="me-2 text-primary" />
                        {perPage} entries
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => handlePerPageChange(5)}>
                          5 entries
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handlePerPageChange(10)}>
                          10 entries
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handlePerPageChange(25)}>
                          25 entries
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handlePerPageChange(50)}>
                          50 entries
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </div>
                  <CButton
                    color="primary"
                    className="px-4 d-flex align-items-center"
                    onClick={() => fetchAnalyticsData(currentPage, perPage, sortBy, sortDirection)}
                  >
                    <CIcon icon={cilReload} className="me-2" />
                    Refresh Data
                  </CButton>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Summary Cards */}
      <CRow className="mb-4 g-3">
        <CCol md={3}>
          <CCard className="stats-card h-100 border-0 shadow-sm">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 mb-3">
                <CIcon icon={cilUser} size="xl" className="text-primary" />
              </div>
              <div className="fs-2 fw-bold text-primary mb-1">{analyticsData?.total || 0}</div>
              <div className="text-muted mb-2">Total Customers</div>
              <CBadge color="primary" className="badge-subtle">
                Active Users
              </CBadge>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="stats-card h-100 border-0 shadow-sm">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 mb-3">
                <CIcon icon={cilScreenDesktop} size="xl" className="text-success" />
              </div>
              <div className="fs-2 fw-bold text-success mb-1">
                {analyticsData?.total_sessions || 0}
              </div>
              <div className="text-muted mb-2">Total Sessions</div>
              <CBadge color="success" className="badge-subtle">
                Platform Visits
              </CBadge>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="stats-card h-100 border-0 shadow-sm">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 mb-3">
                <CIcon icon={cilScreenDesktop} size="xl" className="text-warning" />
              </div>
              <div className="fs-2 fw-bold text-warning mb-1">
                {analyticsData?.total_screens_visited || 0}
              </div>
              <div className="text-muted mb-2">Screens Visited</div>
              <CBadge color="warning" className="badge-subtle">
                Page Views
              </CBadge>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="stats-card h-100 border-0 shadow-sm">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <div className="rounded-circle bg-info bg-opacity-10 p-3 mb-3">
                <CIcon icon={cilClock} size="xl" className="text-info" />
              </div>
              <div className="fs-2 fw-bold text-info mb-1">
                {formatDuration(analyticsData?.total_session_duration || 0)}
              </div>
              <div className="text-muted mb-2">Total Time</div>
              <CBadge color="info" className="badge-subtle">
                Engagement Duration
              </CBadge>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Customer Analytics Table */}
      <CRow>
        <CCol>
          <CCard className="premium-analytics-table border-0 shadow-lg">
            <CCardHeader className="border-0 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div>
                    <h4 className="mb-1 text-dark fw-bold">Customer Analytics Details</h4>
                    <div className="text-dark text-opacity-90 fs-6">
                      Comprehensive customer behavior insights and engagement metrics
                    </div>
                  </div>
                </div>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <div className="table-responsive">
                <CTable className="premium-table align-middle mb-0">
                  <CTableHead>
                    <CTableRow className="premium-table-header">
                      <CTableHeaderCell
                        className="premium-table-th px-4 py-4"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('user_id')}
                      >
                        <div className="d-flex align-items-center">
                          <div className="premium-sort-label">
                            <CIcon icon={cilUser} className="me-2 text-primary" size="sm" />
                            <span className="fw-bold text-dark">Customer Profile</span>
                          </div>
                          <div className="premium-sort-icon ms-auto">
                            <CIcon
                              icon={getSortIcon('user_id')}
                              className="text-primary"
                              size="sm"
                            />
                          </div>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="premium-table-th py-4 text-center"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('session_count')}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="premium-sort-label">
                            <CIcon
                              icon={cilScreenDesktop}
                              className="me-2 text-success"
                              size="sm"
                            />
                            <span className="fw-bold text-dark">Sessions</span>
                          </div>
                          <div className="premium-sort-icon ms-2">
                            <CIcon
                              icon={getSortIcon('session_count')}
                              className="text-success"
                              size="sm"
                            />
                          </div>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="premium-table-th py-4 text-center"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('total_screens_visited')}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="premium-sort-label">
                            <CIcon icon={cilScreenDesktop} className="me-2 text-info" size="sm" />
                            <span className="fw-bold text-dark">Page Views</span>
                          </div>
                          <div className="premium-sort-icon ms-2">
                            <CIcon
                              icon={getSortIcon('total_screens_visited')}
                              className="text-info"
                              size="sm"
                            />
                          </div>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="premium-table-th py-4 text-center"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('total_session_duration')}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="premium-sort-label">
                            <CIcon icon={cilClock} className="me-2 text-warning" size="sm" />
                            <span className="fw-bold text-dark">Total Time</span>
                          </div>
                          <div className="premium-sort-icon ms-2">
                            <CIcon
                              icon={getSortIcon('total_session_duration')}
                              className="text-warning"
                              size="sm"
                            />
                          </div>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell className="premium-table-th py-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <CIcon icon={cilClock} className="me-2 text-secondary" size="sm" />
                          <span className="fw-bold text-dark">Avg Session</span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell className="premium-table-th py-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <CIcon icon={cilChartPie} className="me-2 text-purple" size="sm" />
                          <span className="fw-bold text-dark">Engagement Level</span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="premium-table-th py-4 text-center"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('last_visit')}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="premium-sort-label">
                            <CIcon icon={cilCalendar} className="me-2 text-danger" size="sm" />
                            <span className="fw-bold text-dark">Last Activity</span>
                          </div>
                          <div className="premium-sort-icon ms-2">
                            <CIcon
                              icon={getSortIcon('last_visit')}
                              className="text-danger"
                              size="sm"
                            />
                          </div>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell className="premium-table-th py-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <CIcon icon={cilSettings} className="me-2 text-dark" size="sm" />
                          <span className="fw-bold text-dark">Actions</span>
                        </div>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {analyticsData?.data?.map((customer, index) => {
                      const engagement = getEngagementLevel(
                        customer.session_count,
                        parseInt(customer.total_session_duration),
                      )
                      const avgSessionDuration = Math.round(
                        parseInt(customer.total_session_duration) / customer.session_count,
                      )

                      return (
                        <CTableRow key={customer.user_id} className="premium-table-row">
                          <CTableDataCell className="px-4 py-4">
                            <div className="d-flex align-items-center">
                              <div className="premium-avatar-wrapper me-3">
                                {customer.profile_picture ? (
                                  <img
                                    src={customer.profile_picture}
                                    alt={customer.user_name}
                                    className="premium-avatar-img"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.nextSibling.style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="premium-avatar-initial"
                                  style={{
                                    display: customer.profile_picture ? 'none' : 'flex',
                                  }}
                                >
                                  {customer.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="premium-avatar-status"></div>
                              </div>
                              <div className="premium-customer-info">
                                <div className="premium-customer-name">{customer.user_name}</div>
                                <div className="premium-customer-id">ID: {customer.user_id}</div>
                                {customer.email && (
                                  <div className="premium-customer-email">
                                    <CIcon icon={cilEnvelopeClosed} size="sm" className="me-1" />
                                    <span className="text-truncate" style={{ maxWidth: '180px' }}>
                                      {customer.email}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <div className="premium-metric-container">
                              <div className="premium-metric-badge premium-sessions-badge">
                                {customer.session_count}
                              </div>
                              <div className="premium-metric-label">Total Sessions</div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <div className="premium-metric-container">
                              <div className="premium-metric-value">
                                {customer.total_screens_visited}
                              </div>
                              <div className="premium-metric-sub">
                                {Math.round(
                                  customer.total_screens_visited / customer.session_count,
                                )}{' '}
                                per session
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <div className="premium-metric-container">
                              <div className="premium-metric-value premium-time-value">
                                {formatDuration(parseInt(customer.total_session_duration))}
                              </div>
                              <div className="premium-metric-label">Total Duration</div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <div className="premium-metric-container">
                              <div className="premium-metric-value premium-avg-value">
                                {formatDuration(avgSessionDuration)}
                              </div>
                              <div className="premium-metric-label">Per Session</div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <div className="premium-engagement-container">
                              <div className="premium-engagement-badge">
                                <CBadge
                                  color={engagement.color}
                                  className="premium-engagement-level"
                                >
                                  {engagement.level}
                                </CBadge>
                              </div>
                              <div className="premium-progress-container mt-2">
                                <CProgress className="premium-progress" height={6}>
                                  <CProgressBar
                                    color={engagement.color}
                                    value={engagement.percentage}
                                    className="premium-progress-bar"
                                  />
                                </CProgress>
                                <div className="premium-progress-label">
                                  {engagement.percentage}% engaged
                                </div>
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <div className="premium-date-container">
                              <div className="premium-date-value">
                                {new Date(customer.last_visit).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                              <div className="premium-date-relative">
                                {getTimeSinceLastVisit(customer.last_visit)}
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="py-4 text-center">
                            <CButton
                              className="premium-action-btn"
                              onClick={() => handleViewCustomer(customer)}
                              title="View Detailed Analytics"
                            >
                              <FontAwesomeIcon icon={faEye} className="me-2" />
                              <span>View Details</span>
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Premium Pagination */}
      {analyticsData && analyticsData.last_page > 1 && (
        <CRow className="mt-1">
          <CCol>
            <CCard className="premium-pagination-card border-0">
              <CCardBody className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="premium-pagination-icon">
                      <CIcon icon={cilUser} className="text-white" />
                    </div>
                    <div className="premium-pagination-info">
                      <div className="premium-pagination-text">
                        Showing{' '}
                        <span className="premium-pagination-highlight">{analyticsData.from}</span>{' '}
                        to <span className="premium-pagination-highlight">{analyticsData.to}</span>{' '}
                        of{' '}
                        <span className="premium-pagination-highlight">{analyticsData.total}</span>{' '}
                        results
                      </div>
                      <div className="premium-pagination-subtext">
                        Page {currentPage} of {analyticsData.last_page}
                      </div>
                    </div>
                  </div>
                  <CPagination className="premium-pagination mb-0">
                    <CPaginationItem
                      disabled={!analyticsData.prev_page_url}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="premium-pagination-item premium-pagination-prev"
                    >
                      <CIcon
                        icon={cilArrowTop}
                        className="me-2"
                        style={{ transform: 'rotate(-90deg)' }}
                      />
                      Previous
                    </CPaginationItem>

                    {Array.from({ length: Math.min(analyticsData.last_page, 5) }, (_, i) => {
                      let pageNum
                      if (analyticsData.last_page <= 5) {
                        pageNum = i + 1
                      } else {
                        const start = Math.max(1, currentPage - 2)
                        const end = Math.min(analyticsData.last_page, start + 4)
                        pageNum = start + i
                        if (pageNum > end) return null
                      }

                      return (
                        <CPaginationItem
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum)}
                          className={`premium-pagination-item premium-pagination-number ${
                            pageNum === currentPage ? 'premium-pagination-active' : ''
                          }`}
                        >
                          {pageNum}
                        </CPaginationItem>
                      )
                    })}

                    {analyticsData.last_page > 5 && currentPage < analyticsData.last_page - 2 && (
                      <>
                        <CPaginationItem
                          className="premium-pagination-item premium-pagination-dots"
                          disabled
                        >
                          ...
                        </CPaginationItem>
                        <CPaginationItem
                          onClick={() => handlePageChange(analyticsData.last_page)}
                          className="premium-pagination-item premium-pagination-number"
                        >
                          {analyticsData.last_page}
                        </CPaginationItem>
                      </>
                    )}

                    <CPaginationItem
                      disabled={!analyticsData.next_page_url}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="premium-pagination-item premium-pagination-next"
                    >
                      Next
                      <CIcon
                        icon={cilArrowTop}
                        className="ms-2"
                        style={{ transform: 'rotate(90deg)' }}
                      />
                    </CPaginationItem>
                  </CPagination>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Customer Details Modal */}
      <CModal
        visible={modalVisible}
        onClose={handleCloseModal}
        size="xl"
        className="customer-journey-modal"
      >
        <CModalHeader>
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilUser} className="me-2 text-primary" />
            <div>
              <div className="h5 mb-0">Customer Analytics Details</div>
              <div className="text-muted small">
                Detailed view of customer behavior and engagement
              </div>
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-light py-4">
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
                  <CCard className="customer-details-card border-0">
                    <CCardBody className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="avatar-wrapper me-4" style={{ position: 'relative' }}>
                          {selectedCustomerDetails.customer.customer_profilepic &&
                          !imageError[selectedCustomerDetails.customer.customer_id] ? (
                            <img
                              src={selectedCustomerDetails.customer.customer_profilepic}
                              alt={selectedCustomerDetails.customer.customer_fname}
                              className="avatar-img rounded-circle"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                border: '4px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                              onError={() =>
                                handleImageError(selectedCustomerDetails.customer.customer_id)
                              }
                            />
                          ) : (
                            <div
                              className="avatar-initial rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                              style={{
                                width: '100px',
                                height: '100px',
                                fontSize: '40px',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                            >
                              {selectedCustomerDetails.customer.customer_fname
                                ? selectedCustomerDetails.customer.customer_fname
                                    .charAt(0)
                                    .toUpperCase()
                                : '?'}
                            </div>
                          )}
                          <div
                            className="avatar-status"
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: '3px solid white',
                              backgroundColor:
                                selectedCustomerDetails.customer.customer_status === 'Active'
                                  ? '#2eb85c'
                                  : '#e55353',
                            }}
                          ></div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h2 className="mb-1 text-primary">
                                {selectedCustomerDetails.customer.customer_fname}
                              </h2>
                              <div className="text-muted fs-6 mb-3">
                                Customer since{' '}
                                {new Date(
                                  selectedCustomerDetails.customer.created_at,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <CBadge
                              color={
                                selectedCustomerDetails.customer.customer_status === 'Active'
                                  ? 'success'
                                  : 'danger'
                              }
                              shape="rounded-pill"
                              className="px-3 py-2"
                            >
                              {selectedCustomerDetails.customer.customer_status}
                            </CBadge>
                          </div>
                          <div className="d-flex flex-wrap gap-4">
                            <div>
                              <div className="text-muted small mb-1">Customer ID</div>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilUser} className="me-2 text-primary" />
                                <span className="fw-medium">
                                  {selectedCustomerDetails.customer.customer_id}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-muted small mb-1">Email</div>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilEnvelopeClosed} className="me-2 text-primary" />
                                <span className="fw-medium">
                                  {selectedCustomerDetails.customer.customer_email}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-muted small mb-1">Contact</div>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilCalendar} className="me-2 text-primary" />
                                <span className="fw-medium">
                                  {selectedCustomerDetails.customer.contact_number}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Analytics Overview Cards */}
              <CRow className="mb-4 g-3">
                <CCol md={3}>
                  <CCard className="stats-card h-100">
                    <CCardBody className="d-flex flex-column align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 mb-3">
                        <CIcon icon={cilScreenDesktop} size="xl" className="text-primary" />
                      </div>
                      <div className="fs-2 fw-bold text-primary mb-1">
                        {selectedCustomerDetails.stats.session_count}
                      </div>
                      <div className="text-muted mb-2">Total Sessions</div>
                      <CBadge color="primary" className="badge-subtle">
                        {selectedCustomerDetails.stats.avg_screens_per_session} screens/session
                      </CBadge>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="stats-card h-100">
                    <CCardBody className="d-flex flex-column align-items-center">
                      <div className="rounded-circle bg-success bg-opacity-10 p-3 mb-3">
                        <CIcon icon={cilScreenDesktop} size="xl" className="text-success" />
                      </div>
                      <div className="fs-2 fw-bold text-success mb-1">
                        {selectedCustomerDetails.stats.total_screens_visited}
                      </div>
                      <div className="text-muted mb-2">Screens Visited</div>
                      <CBadge color="success" className="badge-subtle">
                        {Math.round(
                          selectedCustomerDetails.stats.total_screens_visited /
                            selectedCustomerDetails.stats.session_count,
                        )}{' '}
                        per session
                      </CBadge>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="stats-card h-100">
                    <CCardBody className="d-flex flex-column align-items-center">
                      <div className="rounded-circle bg-warning bg-opacity-10 p-3 mb-3">
                        <CIcon icon={cilClock} size="xl" className="text-warning" />
                      </div>
                      <div className="fs-2 fw-bold text-warning mb-1">
                        {formatDuration(selectedCustomerDetails.stats.total_session_duration)}
                      </div>
                      <div className="text-muted mb-2">Total Duration</div>
                      <CBadge color="warning" className="badge-subtle">
                        Avg: {formatDuration(selectedCustomerDetails.stats.avg_session_duration)}
                      </CBadge>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="stats-card h-100">
                    <CCardBody className="d-flex flex-column align-items-center">
                      <div className="rounded-circle bg-info bg-opacity-10 p-3 mb-3">
                        <CIcon icon={cilCalendar} size="xl" className="text-info" />
                      </div>
                      <div className="fs-6 fw-bold text-center text-info mb-1">
                        {new Date(selectedCustomerDetails.stats.first_visit).toLocaleDateString()}{' '}
                        <br />
                        {new Date(selectedCustomerDetails.stats.first_visit).toLocaleTimeString()}
                      </div>
                      <div className="text-muted mb-2">First Visit</div>
                      <CBadge color="info" className="badge-subtle mt-auto">
                        Last:{' '}
                        {new Date(selectedCustomerDetails.stats.last_visit).toLocaleDateString()}{' '}
                        {new Date(selectedCustomerDetails.stats.last_visit).toLocaleTimeString()}
                      </CBadge>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Devices and Routes Section */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <CCard className="h-100 customer-details-card">
                    <CCardHeader className="border-bottom bg-transparent p-4">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                          <CIcon icon={cilScreenDesktop} className="text-primary" />
                        </div>
                        <h5 className="mb-0">Device Information</h5>
                      </div>
                    </CCardHeader>
                    <CCardBody className="p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <div className="d-flex flex-column gap-3">
                        {selectedCustomerDetails.devices.map((device, index) => (
                          <div key={index} className="device-info-card p-3 rounded-3">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="mb-1 text-primary">{device.model}</h6>
                                <div className="text-muted small">
                                  {device.brand} • {device.system_name} {device.system_version}
                                </div>
                              </div>
                              <CBadge color="info" shape="rounded-pill" className="px-3">
                                {device.sessions_count} sessions
                              </CBadge>
                            </div>
                            <div className="row g-3 text-sm mb-3">
                              <div className="col-6">
                                <div className="text-muted small mb-1">Device ID</div>
                                <div className="font-monospace">{device.device_id}</div>
                              </div>
                              <div className="col-6">
                                <div className="text-muted small mb-1">Build Number</div>
                                <div className="font-monospace">{device.build_number}</div>
                              </div>
                            </div>
                            <div className="d-flex gap-4 text-muted small">
                              <div>
                                <CIcon icon={cilCalendar} size="sm" className="me-1 text-primary" />
                                First: {new Date(device.first_seen).toLocaleDateString()}{' '}
                                {new Date(device.first_seen).toLocaleTimeString()}
                              </div>
                              <div>
                                <CIcon icon={cilClock} size="sm" className="me-1 text-primary" />
                                Last: {new Date(device.last_seen).toLocaleDateString()}{' '}
                                {new Date(device.last_seen).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard className="h-100 customer-details-card">
                    <CCardHeader className="border-bottom bg-transparent p-4">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                          <CIcon icon={cilChartPie} className="text-primary" />
                        </div>
                        <h5 className="mb-0">Route Analytics</h5>
                      </div>
                    </CCardHeader>
                    <CCardBody className="p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <div className="d-flex flex-column gap-3">
                        {selectedCustomerDetails.routes.map((route, index) => (
                          <div key={index} className="route-analytics-item p-3 rounded-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                <h6 className="mb-1 text-primary">{route.route_name}</h6>
                                <div className="text-muted small">
                                  {route.sessions_count} sessions •{' '}
                                  {formatDuration(route.average_duration)} avg. duration
                                </div>
                              </div>
                              <CBadge color="primary" shape="rounded-pill" className="px-3">
                                {route.total_visits} visits
                              </CBadge>
                            </div>
                            <div className="mb-1">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="text-muted small">Visit distribution</div>
                                <div className="small fw-medium">
                                  {Math.round(
                                    (route.total_visits /
                                      selectedCustomerDetails.stats.total_screens_visited) *
                                      100,
                                  )}
                                  %
                                </div>
                              </div>
                              <CProgress className="progress-thin">
                                <CProgressBar
                                  color="primary"
                                  value={
                                    (route.total_visits /
                                      selectedCustomerDetails.stats.total_screens_visited) *
                                    100
                                  }
                                />
                              </CProgress>
                            </div>
                            <div className="d-flex gap-3 mt-3">
                              <div>
                                <div className="text-muted small mb-1">Total Duration</div>
                                <div className="fw-medium">
                                  {formatDuration(route.total_duration)}
                                </div>
                              </div>
                              <div className="border-start ps-3">
                                <div className="text-muted small mb-1">Avg Duration</div>
                                <div className="fw-medium">
                                  {formatDuration(route.average_duration)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Sessions Detail */}
              <CRow>
                <CCol>
                  <CCard className="customer-details-card">
                    <CCardHeader className="border-bottom bg-transparent p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                            <CIcon icon={cilClock} className="text-primary" />
                          </div>
                          <h5 className="mb-0">Session History</h5>
                        </div>
                        <CBadge color="primary" className="badge-subtle">
                          {selectedCustomerDetails.sessions.length} Sessions
                        </CBadge>
                      </div>
                    </CCardHeader>
                    <CCardBody className="p-0">
                      <div className="table-responsive">
                        <CTable hover className="session-table mb-0">
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell className="px-4">Session Date</CTableHeaderCell>
                              <CTableHeaderCell>Device</CTableHeaderCell>
                              <CTableHeaderCell className="text-center">
                                Screens Visited
                              </CTableHeaderCell>
                              <CTableHeaderCell>Duration</CTableHeaderCell>
                              <CTableHeaderCell>Routes</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {selectedCustomerDetails.sessions.map((session, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell className="px-4">
                                  <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                      <CIcon
                                        icon={cilCalendar}
                                        size="sm"
                                        className="text-primary"
                                      />
                                    </div>
                                    <div>
                                      <div className="fw-medium">
                                        {new Date(session.created_at).toLocaleDateString()}
                                      </div>
                                      <div className="text-muted small">
                                        {new Date(session.created_at).toLocaleTimeString()}
                                      </div>
                                    </div>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div>
                                    <div className="fw-medium">
                                      {session.device.brand} {session.device.model}
                                    </div>
                                    <div className="text-muted small">
                                      {session.device.system_name} {session.device.system_version}
                                    </div>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  <CBadge color="info" shape="rounded-pill" className="px-3">
                                    {session.total_screens_visited}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="d-flex align-items-center">
                                    <CIcon
                                      icon={cilClock}
                                      size="sm"
                                      className="text-primary me-2"
                                    />
                                    <span className="fw-medium">
                                      {formatDuration(session.total_session_duration)}
                                    </span>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="d-flex flex-wrap gap-2">
                                    {session.routes.map((route, routeIndex) => (
                                      <CBadge
                                        key={routeIndex}
                                        color="light"
                                        className="px-2 py-1 text-dark border"
                                      >
                                        <span className="text-primary">{route.route_name}</span>
                                        <span className="text-muted ms-1">({route.visits})</span>
                                      </CBadge>
                                    ))}
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Customer Information */}
              <CRow className="mt-4">
                <CCol>
                  <CCard className="customer-details-card">
                    <CCardHeader className="border-bottom bg-transparent p-4">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                          <CIcon icon={cilUser} className="text-primary" />
                        </div>
                        <h5 className="mb-0">Customer Information</h5>
                      </div>
                    </CCardHeader>
                    <CCardBody className="p-4">
                      <CRow className="g-4">
                        <CCol md={6}>
                          <div className="customer-info-section">
                            <div className="mb-4">
                              <div className="customer-info-label">Full Name</div>
                              <div className="customer-info-value">
                                {selectedCustomerDetails.customer.customer_fname}
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="customer-info-label">Email Address</div>
                              <div className="customer-info-value d-flex align-items-center">
                                <CIcon
                                  icon={cilEnvelopeClosed}
                                  size="sm"
                                  className="text-primary me-2"
                                />
                                {selectedCustomerDetails.customer.customer_email}
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="customer-info-label">Contact Number</div>
                              <div className="customer-info-value d-flex align-items-center">
                                <CIcon icon={cilUser} size="sm" className="text-primary me-2" />
                                {selectedCustomerDetails.customer.contact_number}
                              </div>
                            </div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="customer-info-section">
                            <div className="mb-4">
                              <div className="customer-info-label">Nationality</div>
                              <div className="customer-info-value">
                                {selectedCustomerDetails.customer.customer_nationality}
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="customer-info-label">Address</div>
                              <div className="customer-info-value">
                                {selectedCustomerDetails.customer.customer_address}
                              </div>
                            </div>
                            <div className="d-flex gap-4">
                              <div className="mb-4">
                                <div className="customer-info-label">Account Created</div>
                                <div className="customer-info-value d-flex align-items-center">
                                  <CIcon
                                    icon={cilCalendar}
                                    size="sm"
                                    className="text-primary me-2"
                                  />
                                  {new Date(
                                    selectedCustomerDetails.customer.created_at,
                                  ).toLocaleDateString()}
                                  <small className="text-muted ms-2">
                                    {new Date(
                                      selectedCustomerDetails.customer.created_at,
                                    ).toLocaleTimeString()}
                                  </small>
                                </div>
                              </div>
                              <div className="mb-4 border-start ps-4">
                                <div className="customer-info-label">Last Updated</div>
                                <div className="customer-info-value d-flex align-items-center">
                                  <CIcon icon={cilClock} size="sm" className="text-primary me-2" />
                                  {new Date(
                                    selectedCustomerDetails.customer.updated_at,
                                  ).toLocaleDateString()}
                                  <small className="text-muted ms-2">
                                    {new Date(
                                      selectedCustomerDetails.customer.updated_at,
                                    ).toLocaleTimeString()}
                                  </small>
                                </div>
                              </div>
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
