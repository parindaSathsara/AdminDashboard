/* eslint-disable */

import React, { useContext, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CBadge,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CWidgetStatsB,
  CButtonGroup,
  CFormCheck,
  CAlert,
  CSpinner,
  CTooltip,
  CImage,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CListGroup,
  CListGroupItem,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CPopover,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import {
  Wallet,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Slash,
  Search,
  Filter,
  Download,
  ArrowClockwise,
  Eye,
  CurrencyDollar,
  Person,
  Bank,
  CashCoin,
  PaypalIcon,
  FileEarmarkImage,
  CloudDownload,
  InfoCircle,
  ExclamationTriangle,
  Check2Circle,
  XOctagon,
  FileText,
  Calendar,
  CreditCard2Front,
  PersonBadge,
  Building,
  GeoAlt,
  Telephone,
  Envelope,
  CheckCircleFill,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from 'react-bootstrap-icons'

import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material'
import { Modal, Tab, Tabs } from 'react-bootstrap'
import Swal from 'sweetalert2'
import LoadingBar from 'react-top-loading-bar'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import axios from 'axios'
import moment from 'moment'

const WalletTransactions = () => {
  const { userData } = useContext(UserLoginContext)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    wallet_stats: { total: 0, active: 0, inactive: 0, suspended: 0 },
    request_stats: { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0, utilized: 0 },
    amount_stats: { total_approved_lkr: 0 },
    recent_requests: [],
  })

  // State for top-up requests with pagination
  const [topUpRequests, setTopUpRequests] = useState([])
  const [totalRequests, setTotalRequests] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [totalPages, setTotalPages] = useState(1)

  // State for wallets with pagination
  const [wallets, setWallets] = useState([])
  const [totalWallets, setTotalWallets] = useState(0)
  const [currentWalletPage, setCurrentWalletPage] = useState(1)
  const [walletPerPage, setWalletPerPage] = useState(15)
  const [totalWalletPages, setTotalWalletPages] = useState(1)

  const [requestDetails, setRequestDetails] = useState(null)

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    currency: '',
    date_from: '',
    date_to: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  // Modal states - Updated to use offcanvas for details
  const [showDetailsOffcanvas, setShowDetailsOffcanvas] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showWalletDetailsOffcanvas, setShowWalletDetailsOffcanvas] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedRequests, setSelectedRequests] = useState([])
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [activeTab, setActiveTab] = useState('requests')

  // Form states
  const [adminNotes, setAdminNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const defaultMaterialTheme = createTheme()

  // API endpoints
  const API_BASE = axios.defaults.baseURL

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'requests') {
      loadTopUpRequests()
    } else {
      loadWallets()
    }
  }, [currentPage, perPage, filters, activeTab, currentWalletPage, walletPerPage])

  const loadDashboardData = async () => {
    setProgress(30)
    try {
      await loadDashboardStats()
      if (activeTab === 'requests') {
        await loadTopUpRequests()
      } else {
        await loadWallets()
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      showErrorAlert('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setProgress(100)
    }
  }

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/wallet/dashboard-stats`)
      if (response.data.success) {
        setDashboardStats(response.data.data)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const loadTopUpRequests = async () => {
    try {
      const params = new URLSearchParams()

      // Add pagination params
      params.append('page', currentPage)
      params.append('per_page', perPage)

      // Add filter params
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })

      console.log(`${API_BASE}/admin/wallet/topup-requests?${params}`, 'Request params')

      const response = await axios.get(`${API_BASE}/admin/wallet/topup-requests?${params}`)
      if (response.data.success) {
        console.log(response?.data?.data, 'Response data')
        const paginationData = response.data.data

        setTopUpRequests(paginationData.data || [])
        setTotalRequests(paginationData.total || 0)
        setCurrentPage(paginationData.current_page || 1)
        setTotalPages(paginationData.last_page || 1)
      }
    } catch (error) {
      console.error('Error loading top-up requests:', error)
      showErrorAlert('Failed to load top-up requests')
    }
  }

  const loadWallets = async () => {
    try {
      const params = new URLSearchParams()
      params.append('page', currentWalletPage)
      params.append('per_page', walletPerPage)

      const response = await axios.get(`${API_BASE}/admin/wallet/wallets?${params}`)
      if (response.data.success) {
        const paginationData = response.data.data

        setWallets(paginationData.data || [])
        setTotalWallets(paginationData.total || 0)
        setCurrentWalletPage(paginationData.current_page || 1)
        setTotalWalletPages(paginationData.last_page || 1)
      }
    } catch (error) {
      console.error('Error loading wallets:', error)
      showErrorAlert('Failed to load wallets')
    }
  }

  const loadRequestDetails = async (requestId) => {
    setProgress(30)
    try {
      const response = await axios.get(`${API_BASE}/admin/wallet/topup-requests/${requestId}`)
      if (response.data.success) {
        setRequestDetails(response.data.data)
        setSelectedRequest(response.data.data)
        setShowDetailsOffcanvas(true)
      }
    } catch (error) {
      console.error('Error loading request details:', error)
      showErrorAlert('Failed to load request details')
    } finally {
      setProgress(100)
    }
  }

  const loadWalletDetails = async (walletId) => {
    setProgress(30)
    try {
      const response = await axios.get(`${API_BASE}/admin/wallet/wallets/${walletId}`)
      if (response.data.success) {
        // Extract wallet data and statistics from the nested response
        const walletData = {
          ...response.data.data.wallet,
          statistics: response.data.data.statistics,
        }
        setSelectedWallet(walletData)
        setShowWalletDetailsOffcanvas(true)
      }
    } catch (error) {
      console.error('Error loading wallet details:', error)
      showErrorAlert('Failed to load wallet details')
    } finally {
      setProgress(100)
    }
  }

  const handleApproveRequest = async (requestId, notes = '') => {
    setProgress(50)
    try {
      const response = await axios.post(
        `${API_BASE}/admin/wallet/topup-requests/${requestId}/approve`,
        {
          admin_notes: notes,
        },
      )

      if (response.data.success) {
        showSuccessAlert('Top-up request approved successfully')
        loadTopUpRequests()
        loadDashboardStats()
        setShowApproveModal(false)
        setShowDetailsOffcanvas(false)
        setAdminNotes('')
      }
    } catch (error) {
      showErrorAlert('Failed to approve request')
    } finally {
      setProgress(100)
    }
  }

  const handleRejectRequest = async (requestId, reason, notes = '') => {
    setProgress(50)
    try {
      const response = await axios.post(
        `${API_BASE}/admin/wallet/topup-requests/${requestId}/reject`,
        {
          rejected_reason: reason,
          admin_notes: notes,
        },
      )

      if (response.data.success) {
        showSuccessAlert('Top-up request rejected')
        loadTopUpRequests()
        loadDashboardStats()
        setShowRejectModal(false)
        setShowDetailsOffcanvas(false)
        setRejectionReason('')
        setAdminNotes('')
      }
    } catch (error) {
      showErrorAlert('Failed to reject request')
    } finally {
      setProgress(100)
    }
  }

  const handleBulkApprove = async (requestIds, notes = '') => {
    setProgress(50)
    try {
      const response = await axios.post(`${API_BASE}/admin/wallet/topup-requests/bulk-approve`, {
        request_ids: requestIds,
        admin_notes: notes,
      })

      if (response.data.success) {
        showSuccessAlert(`${response.data.data.approved_count} requests approved successfully`)
        loadTopUpRequests()
        loadDashboardStats()
        setShowBulkModal(false)
        setSelectedRequests([])
        setAdminNotes('')
      }
    } catch (error) {
      showErrorAlert('Failed to approve requests')
    } finally {
      setProgress(100)
    }
  }

const handleExport = async () => {
  setProgress(50);
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });

    // Get token from your auth context
    const token = localStorage.getItem('token') || userData?.token; 

    const response = await axios.get(`${API_BASE}/admin/wallet/export-topup-requests?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      responseType: 'blob' // Important for file downloads
    });

    // Create blob URL from response
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `topup_requests_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);
    
    showSuccessAlert('Export completed successfully');
  } catch (error) {
    console.error('Export failed:', error);
    showErrorAlert(error.response?.data?.message || 'Export failed');
  } finally {
    setProgress(100);
  }
};

  const handleDownloadReceipt = async (requestId, filename = 'receipt') => {
    if (!requestId) return

    setProgress(30) // Show loading

    try {
      const response = await axios({
        method: 'GET',
        url: `/admin/wallet/topup-requests/${requestId}/download-receipt`,
        responseType: 'blob',
      })

      // Create blob URL from response
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)

      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let downloadFilename = filename

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          downloadFilename = filenameMatch[1]
        }
      }

      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = downloadFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      window.URL.revokeObjectURL(url)

      showSuccessAlert('Receipt downloaded successfully')
    } catch (error) {
      console.error('Download failed:', error)

      if (error.response?.status === 404) {
        showErrorAlert('Receipt file not found')
      } else if (error.response?.status === 403) {
        showErrorAlert('You do not have permission to download this file')
      } else {
        showErrorAlert('Failed to download receipt. Please try again.')
      }
    } finally {
      setProgress(100)
    }
  }

  const getReceiptUrl = (receiptPath) => {
    if (!receiptPath) return null
    return `${receiptPath}`
  }

  const isImageFile = (filename) => {
    if (!filename) return false
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return imageExtensions.some((ext) => filename.toLowerCase().includes(ext))
  }

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#28a745',
      timer: 3000,
      timerProgressBar: true,
    })
  }

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#dc3545',
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: Clock },
      approved: { color: 'success', icon: CheckCircle },
      utilized: { color: 'info', icon: CheckCircleFill },
      rejected: { color: 'danger', icon: XCircle },
      cancelled: { color: 'secondary', icon: Slash },
      active: { color: 'success', icon: CheckCircle },
      inactive: { color: 'warning', icon: Clock },
      suspended: { color: 'danger', icon: XCircle },
    }

    const config = statusConfig[status] || { color: 'secondary', icon: Clock }
    const IconComponent = config.icon

    return (
      <CBadge color={config.color} className="d-flex align-items-center gap-1">
        <IconComponent size={12} />
        {status?.toUpperCase()}
      </CBadge>
    )
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank_transfer: Bank,
      credit_card: CreditCard,
      paypal: CashCoin,
      mobile_payment: Wallet,
    }
    return icons[method] || CurrencyDollar
  }

  const formatCurrency = (amount, currency) => {
    return `${currency} ${parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
  }

  // Pagination handlers
  const handlePageChange = (page) => {
    if (activeTab === 'requests') {
      setCurrentPage(page)
    } else {
      setCurrentWalletPage(page)
    }
  }

  const handlePerPageChange = (newPerPage) => {
    if (activeTab === 'requests') {
      setPerPage(newPerPage)
      setCurrentPage(1) // Reset to first page
    } else {
      setWalletPerPage(newPerPage)
      setCurrentWalletPage(1) // Reset to first page
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Quick Action Component
  const QuickActions = ({ request, onApprove, onReject }) => (
    <div className="d-flex gap-1">
      <CTooltip content="Approve">
        <CButton size="sm" color="success" variant="ghost" onClick={() => onApprove(request)}>
          <Check2Circle size={14} />
        </CButton>
      </CTooltip>
      <CTooltip content="Reject">
        <CButton size="sm" color="danger" variant="ghost" onClick={() => onReject(request)}>
          <XOctagon size={14} />
        </CButton>
      </CTooltip>
    </div>
  )

  // Info Row Component for details
  const InfoRow = ({ icon: IconComponent, label, value, color = 'text-muted' }) => (
    <div className="d-flex align-items-center mb-2">
      <div className="me-2">
        <IconComponent size={16} className={color} />
      </div>
      <div className="flex-grow-1">
        <small className="text-muted d-block">{label}</small>
        <div className="fw-medium">{value || 'N/A'}</div>
      </div>
    </div>
  )

  // Custom Pagination Component
  const CustomPagination = ({
    currentPage,
    totalPages,
    totalItems,
    perPage,
    onPageChange,
    onPerPageChange,
  }) => {
    const startItem = (currentPage - 1) * perPage + 1
    const endItem = Math.min(currentPage * perPage, totalItems)

    const getVisiblePages = () => {
      if (totalPages <= 1) return []

      const delta = 2
      const range = []
      const rangeWithDots = []

      // Always include first page
      if (totalPages === 1) {
        return [1]
      }

      // Generate range around current page
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i)
      }

      // Build final array with dots
      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages)
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }

      // Remove duplicates
      return rangeWithDots.filter((item, index, arr) => index === 0 || arr[index - 1] !== item)
    }

    const paginationItemStyle = {
      minWidth: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '1px solid #dee2e6',
      color: '#6c757d',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
    }

    const activePaginationItemStyle = {
      ...paginationItemStyle,
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
      color: '#fff',
    }

    const disabledPaginationItemStyle = {
      ...paginationItemStyle,
      cursor: 'not-allowed',
      opacity: '0.6',
      backgroundColor: '#f8f9fa',
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <small className="text-muted">
            Showing {startItem} to {endItem} of {totalItems} results
          </small>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">Per page:</small>
            <CFormSelect
              size="sm"
              style={{ width: '80px' }}
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </CFormSelect>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="d-flex align-items-center">
            {/* First Page Button */}
            <div
              style={currentPage === 1 ? disabledPaginationItemStyle : paginationItemStyle}
              onClick={() => currentPage !== 1 && onPageChange(1)}
              className="me-1 rounded-start"
            >
              <ChevronDoubleLeft size={14} />
            </div>

            {/* Previous Page Button */}
            <div
              style={currentPage === 1 ? disabledPaginationItemStyle : paginationItemStyle}
              onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}
              className="me-1"
            >
              <ChevronLeft size={14} />
            </div>

            {/* Page Numbers */}
            {getVisiblePages().map((page, index) => (
              <div
                key={`page-${index}-${page}`}
                style={
                  page === '...'
                    ? disabledPaginationItemStyle
                    : page === currentPage
                    ? activePaginationItemStyle
                    : paginationItemStyle
                }
                onClick={() =>
                  typeof page === 'number' && page !== currentPage && onPageChange(page)
                }
                className="me-1"
              >
                {page}
              </div>
            ))}

            {/* Next Page Button */}
            <div
              style={currentPage === totalPages ? disabledPaginationItemStyle : paginationItemStyle}
              onClick={() => currentPage !== totalPages && onPageChange(currentPage + 1)}
              className="me-1"
            >
              <ChevronRight size={14} />
            </div>

            {/* Last Page Button */}
            <div
              style={currentPage === totalPages ? disabledPaginationItemStyle : paginationItemStyle}
              onClick={() => currentPage !== totalPages && onPageChange(totalPages)}
              className="rounded-end"
            >
              <ChevronDoubleRight size={14} />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Material Table Data Configuration
  const topUpRequestsTableData = {
    columns: [
      {
        title: 'ID',
        field: 'id',
        width: 80,
        render: (rowData) => <div className="text-primary fw-bold">#{rowData.id}</div>,
      },
      {
        title: 'Customer',
        field: 'customer',
        render: (rowData) => (
          <div>
            <div className="fw-medium text-truncate" style={{ maxWidth: '150px' }}>
              {rowData.customer?.name || rowData.user?.username || 'N/A'}
            </div>
            <small className="text-muted text-truncate d-block" style={{ maxWidth: '150px' }}>
              {rowData.user?.email || rowData.customer?.customer_email || 'N/A'}
            </small>
          </div>
        ),
      },
      {
        title: 'Amount',
        field: 'amount',
        render: (rowData) => (
          <div
            className="fw-bold"
            style={{ color: rowData?.status === 'utilized' ? 'red' : 'green' }}
          >
            {formatCurrency(rowData.amount, rowData.currency)}
          </div>
        ),
      },
      {
        title: 'Method',
        field: 'payment_method',
        render: (rowData) => {
          const IconComponent = getPaymentMethodIcon(rowData.payment_method)
          return (
            <div className="d-flex align-items-center gap-1">
              <IconComponent size={14} />
              <small>{rowData.payment_method?.replace('_', ' ')?.toUpperCase()}</small>
            </div>
          )
        },
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) => getStatusBadge(rowData.status),
      },
      {
        title: 'Date',
        field: 'created_at',
        render: (rowData) => <small>{new Date(rowData.created_at).toLocaleDateString()}</small>,
      },
      {
        title: 'Actions',
        field: 'actions',
        sorting: false,
        export: false,
        width: 120,
        render: (rowData) => (
          <div className="d-flex gap-1">
            <CTooltip content="View Details">
              <CButton
                size="sm"
                color="info"
                variant="ghost"
                onClick={() => loadRequestDetails(rowData.id)}
              >
                <Eye size={14} />
              </CButton>
            </CTooltip>

            {rowData.status === 'pending' && (
              <QuickActions
                request={rowData}
                onApprove={(request) => {
                  setSelectedRequest(request)
                  setShowApproveModal(true)
                }}
                onReject={(request) => {
                  setSelectedRequest(request)
                  setShowRejectModal(true)
                }}
              />
            )}
          </div>
        ),
      },
    ],
    rows: topUpRequests,
  }

  const walletsTableData = {
    columns: [
      {
        title: 'ID',
        field: 'id',
        width: 80,
        render: (rowData) => <div className="text-primary fw-bold">#{rowData.id}</div>,
      },
      {
        title: 'Customer',
        field: 'customer',
        render: (rowData) => (
          <div>
            <div className="fw-medium text-truncate" style={{ maxWidth: '150px' }}>
              {rowData.customer?.name || rowData.user?.username || 'N/A'}
            </div>
            <small className="text-muted text-truncate d-block" style={{ maxWidth: '150px' }}>
              {rowData.user?.email || rowData.customer?.customer_email || 'N/A'}
            </small>
          </div>
        ),
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) => getStatusBadge(rowData.status),
      },
      {
        title: 'Created',
        field: 'created_at',
        render: (rowData) => <small>{new Date(rowData.created_at).toLocaleDateString()}</small>,
      },
      {
        title: 'Actions',
        field: 'actions',
        sorting: false,
        export: false,
        render: (rowData) => (
          <CTooltip content="View Details">
            <CButton
              size="sm"
              color="primary"
              variant="ghost"
              onClick={() => loadWalletDetails(rowData.id)}
            >
              <Eye size={14} />
            </CButton>
          </CTooltip>
        ),
      },
    ],
    rows: wallets,
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <LoadingBar
        color="#58c67d"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
      />

      {/* Main Content Card */}
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="bg-white border-bottom-0 pb-0">
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0 text-dark">Wallet Management</h4>
              <small className="text-muted">
                Manage wallet top-up requests and customer wallets
              </small>
            </CCol>
            <CCol xs="auto">
              <CButtonGroup>
                <CButton
                  color={activeTab === 'requests' ? 'primary' : 'light'}
                  onClick={() => setActiveTab('requests')}
                  size="sm"
                >
                  Requests
                </CButton>
                <CButton
                  color={activeTab === 'wallets' ? 'primary' : 'light'}
                  onClick={() => setActiveTab('wallets')}
                  size="sm"
                >
                  Wallets
                </CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody className="pt-3">
          {/* Compact Filters */}
          {activeTab === 'requests' ? (
            <CRow className="mb-3 g-2">
              <CCol md={2}>
                <CFormSelect
                  size="sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="utilized">Utilized</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  size="sm"
                  value={filters.payment_method}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, payment_method: e.target.value })
                  }
                >
                  <option value="">Payment Method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="mobile_payment">Mobile Payment</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CInputGroup size="sm">
                  <CInputGroupText>
                    <Search size={14} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Search by name, email, or reference..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={2}>
                <CButtonGroup size="sm">
                  <CButton
                    color="info"
                    variant="ghost"
                    onClick={() => (activeTab === 'requests' ? loadTopUpRequests() : loadWallets())}
                  >
                    <ArrowClockwise size={14} />
                  </CButton>
                  <CButton color="success" variant="ghost" onClick={handleExport}>
                    <Download size={14} />
                  </CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
          ) : null}

          {/* Compact Bulk Actions */}
          {selectedRequests.length > 0 && activeTab === 'requests' && (
            <CAlert
              color="primary"
              className="d-flex justify-content-between align-items-center py-2"
            >
              <small>{selectedRequests.length} requests selected</small>
              <CButton color="success" size="sm" onClick={() => setShowBulkModal(true)}>
                <Check2Circle size={14} className="me-1" />
                Bulk Approve
              </CButton>
            </CAlert>
          )}

          {/* Material Table with disabled pagination */}
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              title=""
              data={activeTab === 'requests' ? topUpRequestsTableData.rows : walletsTableData.rows}
              columns={
                activeTab === 'requests' ? topUpRequestsTableData.columns : walletsTableData.columns
              }
              options={{
                sorting: true,
                search: false,
                filtering: false,
                paging: false, // Disable Material Table pagination
                exportButton: false,
                selection: activeTab === 'requests',
                showSelectAllCheckbox: activeTab === 'requests',
                grouping: false,
                columnsButton: false,
                minBodyHeight: 'auto',
                maxBodyHeight: 'none',
                tableLayout: 'auto',
                headerStyle: {
                  background: '#f8f9fa',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                },
                rowStyle: (rowData) => ({
                  fontSize: '14px',
                  padding: '8px 16px',
                  backgroundColor:
                    rowData.status === 'rejected'
                      ? '#fef2f2'
                      : rowData.status === 'approved'
                      ? '#f0fdf4'
                      : rowData.status === 'utilized'
                      ? '#f0f9ff'
                      : '#ffffff',
                }),
                toolbar: false,
                emptyRowsWhenPaging: false,
                doubleHorizontalScroll: false,
              }}
              onSelectionChange={(rows) => {
                setSelectedRequests(rows.map((row) => row.id))
              }}
            />
          </ThemeProvider>

          {/* Custom Pagination */}
          <CustomPagination
            currentPage={activeTab === 'requests' ? currentPage : currentWalletPage}
            totalPages={activeTab === 'requests' ? totalPages : totalWalletPages}
            totalItems={activeTab === 'requests' ? totalRequests : totalWallets}
            perPage={activeTab === 'requests' ? perPage : walletPerPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </CCardBody>
      </CCard>

      {/* Request Details Offcanvas */}
      <COffcanvas
        placement="end"
        visible={showDetailsOffcanvas}
        onHide={() => setShowDetailsOffcanvas(false)}
        backdrop={true}
        style={{ width: '500px' }}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>
            <div className="d-flex align-items-center gap-2">
              <FileText size={20} />
              Request #{requestDetails?.id}
            </div>
          </COffcanvasTitle>
        </COffcanvasHeader>
        <COffcanvasBody>
          {requestDetails && (
            <div>
              {/* Status Header */}
              <div className="mb-4 p-3 rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  {getStatusBadge(requestDetails.status)}
                  <div className="fw-bold text-success">
                    {formatCurrency(requestDetails.amount, requestDetails.currency)}
                  </div>
                </div>
                <small className="text-muted">
                  Submitted: {new Date(requestDetails.submitted_at).toLocaleString()}
                </small>

                <br></br>

                {requestDetails.status == 'cancelled' ? (
                  <small className="text-muted">
                    Cancelled at: {new Date(requestDetails.cancelled_at).toLocaleString()}
                  </small>
                ) : null}

                {requestDetails.status == 'rejected' ? (
                  <small className="text-muted">
                    Rejected at:{' '}
                    {(() => {
                      const gmtDate = new Date(requestDetails.verified_at)
                      // Add 5 hours and 30 minutes (5.5 * 60 * 60 * 1000 milliseconds)
                      const istDate = new Date(gmtDate.getTime() + 5.5 * 60 * 60 * 1000)
                      return istDate.toLocaleString('en-US')
                    })()}{' '}
                  </small>
                ) : null}
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center gap-2">
                  <PersonBadge size={16} />
                  Customer Details
                </h6>
                <InfoRow
                  icon={Person}
                  label="Name"
                  value={requestDetails.customer?.name || requestDetails.user?.username}
                />
                <InfoRow
                  icon={Envelope}
                  label="Email"
                  value={requestDetails.user?.email || requestDetails.customer?.customer_email}
                />
                <InfoRow
                  icon={Telephone}
                  label="Contact"
                  value={requestDetails.customer?.contact_number}
                />
                <InfoRow
                  icon={GeoAlt}
                  label="Address"
                  value={requestDetails.customer?.customer_address}
                />
              </div>

              {/* Payment Info */}
              <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center gap-2">
                  <CreditCard2Front size={16} />
                  Payment Details
                </h6>
                <InfoRow
                  icon={getPaymentMethodIcon(requestDetails.payment_method)}
                  label="Method"
                  value={requestDetails.payment_method?.replace('_', ' ')?.toUpperCase()}
                />
                <InfoRow
                  icon={FileText}
                  label="Reference"
                  value={requestDetails.payment_reference}
                />
                {requestDetails.verified_at && (
                  <InfoRow
                    icon={Calendar}
                    label="Verified"
                    value={new Date(requestDetails.verified_at).toLocaleString()}
                  />
                )}
              </div>

              {/* Bank Details */}
              {requestDetails.payment_method === 'bank_transfer' && requestDetails.bank_details && (
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <Building size={16} />
                    Bank Transfer
                  </h6>
                  <InfoRow
                    icon={Building}
                    label="Bank Name"
                    value={requestDetails.bank_details.bank_name}
                  />
                  <InfoRow
                    icon={CreditCard}
                    label="Account Number"
                    value={requestDetails.bank_details.account_number}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Transfer Date"
                    value={requestDetails.bank_details.transfer_date}
                  />
                </div>
              )}

              {/* Receipt */}
              {requestDetails.payment_slip && (
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <FileEarmarkImage size={16} />
                    Payment Receipt
                  </h6>
                  <div className="border rounded p-3">
                    <div className="mb-2">
                      <small className="text-muted">File:</small>
                      <div>{requestDetails.payment_slip.original_name}</div>
                    </div>
                    <div className="d-flex gap-2">
                      <CButton
                        size="sm"
                        color="primary"
                        variant="ghost"
                        onClick={() =>
                          handleDownloadReceipt(
                            requestDetails?.id,
                            requestDetails?.payment_slip?.original_name,
                          )
                        }
                      >
                        <CloudDownload size={14} className="me-1" />
                        Download
                      </CButton>
                      {isImageFile(requestDetails.payment_slip.original_name) && (
                        <CButton
                          size="sm"
                          color="info"
                          variant="ghost"
                          onClick={() => setShowReceiptModal(true)}
                        >
                          <Eye size={14} className="me-1" />
                          Preview
                        </CButton>
                      )}
                    </div>
                    {/* Image preview if available */}
                    {isImageFile(requestDetails.payment_slip.original_name) && (
                      <div className="mt-2">
                        <CImage
                          src={getReceiptUrl(requestDetails.payment_slip.path)}
                          alt="Receipt Preview"
                          style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {requestDetails.admin_notes && (
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <InfoCircle size={16} />
                    Admin Notes
                  </h6>
                  <div className="border rounded p-3 bg-light">
                    {(() => {
                      try {
                        const trimmed = requestDetails.admin_notes.trim()
                        const parsed = JSON.parse(trimmed)
                        const fieldsToShow = [
                          'order_number',
                          'original_amount',
                          'original_currency',
                        ]

                        return (
                          <div>
                            {fieldsToShow.map((key) => {
                              if (parsed[key] !== undefined) {
                                return (
                                  <div key={key} className="mb-1">
                                    <small className="text-muted">
                                      {key
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                                      :
                                    </small>
                                    <div className="fw-medium">{String(parsed[key])}</div>
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        )
                      } catch (e) {
                        return (
                          <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                            {requestDetails.admin_notes}
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {requestDetails.rejected_reason && (
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2 text-danger">
                    <ExclamationTriangle size={16} />
                    Rejection Reason
                  </h6>
                  <div className="border border-danger rounded p-3 bg-danger-subtle">
                    <div className="text-danger fw-medium">{requestDetails.rejected_reason}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {requestDetails?.status === 'pending' && (
                <div className="border-top pt-3 mt-4">
                  <div className="d-grid gap-2">
                    <CButton
                      color="success"
                      onClick={() => {
                        setShowDetailsOffcanvas(false)
                        setShowApproveModal(true)
                      }}
                    >
                      <CheckCircle size={16} className="me-2" />
                      Approve Request
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      onClick={() => {
                        setShowDetailsOffcanvas(false)
                        setShowRejectModal(true)
                      }}
                    >
                      <XCircle size={16} className="me-2" />
                      Reject Request
                    </CButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </COffcanvasBody>
      </COffcanvas>

      {/* Wallet Details Offcanvas */}
      <COffcanvas
        placement="end"
        visible={showWalletDetailsOffcanvas}
        onHide={() => setShowWalletDetailsOffcanvas(false)}
        backdrop={true}
        style={{ width: '500px' }}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>
            <div className="d-flex align-items-center gap-2">
              <Wallet size={20} />
              Wallet #{selectedWallet?.id}
            </div>
          </COffcanvasTitle>
        </COffcanvasHeader>
        <COffcanvasBody>
          {selectedWallet && (
            <div>
              {/* Wallet Status Header */}
              <div className="mb-4 p-3 rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  {getStatusBadge(selectedWallet.status)}
                  <div className="fw-bold text-primary">
                    Rs.{' '}
                    {parseFloat(selectedWallet.balance || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <small className="text-muted">
                  Created: {new Date(selectedWallet.created_at).toLocaleString()}
                </small>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center gap-2">
                  <PersonBadge size={16} />
                  Customer Details
                </h6>
                <InfoRow
                  icon={Person}
                  label="Name"
                  value={selectedWallet.customer?.name || selectedWallet.user?.username}
                />
                <InfoRow
                  icon={Envelope}
                  label="Email"
                  value={selectedWallet.user?.email || selectedWallet.customer?.customer_email}
                />
                <InfoRow
                  icon={Telephone}
                  label="Contact"
                  value={selectedWallet.customer?.contact_number}
                />
                <InfoRow
                  icon={GeoAlt}
                  label="Address"
                  value={selectedWallet.customer?.customer_address}
                />
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2">
                    <CheckCircle size={16} className="text-muted" />
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block">Customer Status</small>
                    <CBadge
                      color={
                        selectedWallet.customer?.customer_status === 'Active'
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {selectedWallet.customer?.customer_status || 'N/A'}
                    </CBadge>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center gap-2">
                  <Wallet size={16} />
                  Account Information
                </h6>
                <InfoRow
                  icon={PersonBadge}
                  label="User Role"
                  value={selectedWallet.user?.user_role}
                />
                <InfoRow
                  icon={PersonBadge}
                  label="User Type"
                  value={selectedWallet.user?.user_type}
                />
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2">
                    <CheckCircle size={16} className="text-muted" />
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block">User Status</small>
                    <CBadge
                      color={selectedWallet.user?.user_status === 'Active' ? 'success' : 'warning'}
                    >
                      {selectedWallet.user?.user_status || 'N/A'}
                    </CBadge>
                  </div>
                </div>
                <InfoRow
                  icon={Calendar}
                  label="Last Updated"
                  value={new Date(selectedWallet.updated_at).toLocaleString()}
                />
              </div>

              {/* Transaction Statistics */}
              {selectedWallet.statistics && (
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <CurrencyDollar size={16} />
                    Transaction Statistics
                  </h6>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold text-primary h5 mb-0">
                          {selectedWallet.statistics.total_requests}
                        </div>
                        <small className="text-muted">Total Requests</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold text-warning h5 mb-0">
                          {selectedWallet.statistics.pending_requests}
                        </div>
                        <small className="text-muted">Pending</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold text-success h5 mb-0">
                          {selectedWallet.statistics.approved_requests}
                        </div>
                        <small className="text-muted">Approved</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold text-info h5 mb-0">
                          {selectedWallet.statistics.utilized_requests || 0}
                        </div>
                        <small className="text-muted">Utilized</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold text-danger h5 mb-0">
                          {selectedWallet.statistics.rejected_requests}
                        </div>
                        <small className="text-muted">Rejected</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 border rounded bg-success-subtle">
                    <div className="text-center">
                      <div className="fw-bold text-success h6 mb-1">
                        Rs.{' '}
                        {parseFloat(
                          selectedWallet.statistics.total_approved_amount_lkr || 0,
                        ).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <small className="text-muted">Total Approved Amount</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </COffcanvasBody>
      </COffcanvas>

      {/* Compact Receipt Modal */}
      <CModal visible={showReceiptModal} onClose={() => setShowReceiptModal(false)} size="lg">
        <CModalHeader className="border-0 pb-0">
          <CModalTitle>
            <div className="d-flex align-items-center gap-2">
              <FileEarmarkImage size={18} />
              Payment Receipt
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center pt-0">
          {requestDetails?.payment_slip &&
            isImageFile(requestDetails.payment_slip.original_name) && (
              <CImage
                src={getReceiptUrl(requestDetails.payment_slip.path)}
                alt="Payment Receipt"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                className="border rounded shadow-sm"
              />
            )}
        </CModalBody>
        <CModalFooter className="border-0 pt-0">
          <CButton
            color="primary"
            size="sm"
            onClick={() =>
              handleDownloadReceipt(requestDetails?.id, requestDetails?.payment_slip?.original_name)
            }
          >
            <CloudDownload size={14} className="me-1" />
            Download
          </CButton>
          <CButton color="secondary" size="sm" onClick={() => setShowReceiptModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Compact Approve Modal */}
      <CModal visible={showApproveModal} onClose={() => setShowApproveModal(false)} size="sm">
        <CModalHeader className="border-0 pb-2">
          <CModalTitle className="h6">
            <div className="d-flex align-items-center gap-2 text-success">
              <Check2Circle size={18} />
              Approve Request #{selectedRequest?.id || requestDetails?.id}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-0">
          <div className="mb-3 p-2 bg-success-subtle rounded text-center">
            <div className="fw-bold text-success">
              {formatCurrency(
                selectedRequest?.amount || requestDetails?.amount,
                selectedRequest?.currency || requestDetails?.currency,
              )}
            </div>
            <small className="text-muted">
              {selectedRequest?.customer?.name ||
                requestDetails?.customer?.name ||
                selectedRequest?.user?.username ||
                requestDetails?.user?.username}
            </small>
          </div>
          <CForm>
            <CFormLabel className="form-label-sm">Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              size="sm"
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes about this approval..."
            />
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0 pt-0">
          <CButton color="secondary" size="sm" onClick={() => setShowApproveModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="success"
            size="sm"
            onClick={() =>
              handleApproveRequest(selectedRequest?.id || requestDetails?.id, adminNotes)
            }
          >
            <Check2Circle size={14} className="me-1" />
            Approve
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Compact Reject Modal */}
      <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)} size="sm">
        <CModalHeader className="border-0 pb-2">
          <CModalTitle className="h6">
            <div className="d-flex align-items-center gap-2 text-danger">
              <XOctagon size={18} />
              Reject Request #{selectedRequest?.id || requestDetails?.id}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-0">
          <div className="mb-3 p-2 bg-danger-subtle rounded text-center">
            <div className="fw-bold text-danger">
              {formatCurrency(
                selectedRequest?.amount || requestDetails?.amount,
                selectedRequest?.currency || requestDetails?.currency,
              )}
            </div>
            <small className="text-muted">
              {selectedRequest?.customer?.name ||
                requestDetails?.customer?.name ||
                selectedRequest?.user?.username ||
                requestDetails?.user?.username}
            </small>
          </div>
          <CForm>
            <CFormLabel className="form-label-sm">Rejection Reason *</CFormLabel>
            <CFormTextarea
              size="sm"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              required
            />
            <CFormLabel className="form-label-sm mt-2">Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              size="sm"
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0 pt-0">
          <CButton color="secondary" size="sm" onClick={() => setShowRejectModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            size="sm"
            onClick={() =>
              handleRejectRequest(
                selectedRequest?.id || requestDetails?.id,
                rejectionReason,
                adminNotes,
              )
            }
            disabled={!rejectionReason.trim()}
          >
            <XOctagon size={14} className="me-1" />
            Reject
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Compact Bulk Approve Modal */}
      <CModal visible={showBulkModal} onClose={() => setShowBulkModal(false)} size="sm">
        <CModalHeader className="border-0 pb-2">
          <CModalTitle className="h6">
            <div className="d-flex align-items-center gap-2 text-success">
              <Check2Circle size={18} />
              Bulk Approve Requests
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-0">
          <div className="mb-3 p-2 bg-success-subtle rounded text-center">
            <div className="fw-bold text-success h6 mb-0">{selectedRequests.length} Requests</div>
            <small className="text-muted">Ready for approval</small>
          </div>
          <CForm>
            <CFormLabel className="form-label-sm">Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              size="sm"
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes for all approved requests..."
            />
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0 pt-0">
          <CButton color="secondary" size="sm" onClick={() => setShowBulkModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="success"
            size="sm"
            onClick={() => handleBulkApprove(selectedRequests, adminNotes)}
          >
            <Check2Circle size={14} className="me-1" />
            Approve All
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default WalletTransactions
