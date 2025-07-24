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
  CImage
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
  CloudDownload
} from 'react-bootstrap-icons'

import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material'
import { Modal, Tab, Tabs } from 'react-bootstrap'
import Swal from 'sweetalert2'
import LoadingBar from 'react-top-loading-bar'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import axios from 'axios'

const WalletTransactions = () => {
  const { userData } = useContext(UserLoginContext)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    wallet_stats: { total: 0, active: 0, inactive: 0, suspended: 0 },
    request_stats: { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 },
    amount_stats: { total_approved_lkr: 0 },
    recent_requests: []
  })

  // State for top-up requests
  const [topUpRequests, setTopUpRequests] = useState([])
  const [wallets, setWallets] = useState([])
  const [requestDetails, setRequestDetails] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    currency: '',
    date_from: '',
    date_to: '',
    search: ''
  })

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedRequests, setSelectedRequests] = useState([])
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

  const loadDashboardData = async () => {
    setProgress(30)
    try {
      await Promise.all([
        loadDashboardStats(),
        loadTopUpRequests(),
        loadWallets()
      ])
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
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const response = await axios.get(`${API_BASE}/admin/wallet/topup-requests?${params}`)
      if (response.data.success) {

        console.log(response?.data?.data,"Data valuessss areeeeeeeeeeXXXXX")
        setTopUpRequests(response.data.data.data || [])
      }
    } catch (error) {
      console.error('Error loading top-up requests:', error)
    }
  }

  const loadWallets = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/wallet/wallets`)
      if (response.data.success) {
        setWallets(response.data.data.data || [])
      }
    } catch (error) {
      console.error('Error loading wallets:', error)
    }
  }

  const loadRequestDetails = async (requestId) => {
    setProgress(30)
    try {
      const response = await axios.get(`${API_BASE}/admin/wallet/topup-requests/${requestId}`)
      if (response.data.success) {
        setRequestDetails(response.data.data)
        setSelectedRequest(response.data.data)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error('Error loading request details:', error)
      showErrorAlert('Failed to load request details')
    } finally {
      setProgress(100)
    }
  }

  const handleApproveRequest = async (requestId, notes = '') => {
    setProgress(50)
    try {
      const response = await axios.post(`${API_BASE}/admin/wallet/topup-requests/${requestId}/approve`, {
        admin_notes: notes
      })
      
      if (response.data.success) {
        showSuccessAlert('Top-up request approved successfully')
        loadTopUpRequests()
        loadDashboardStats()
        setShowApproveModal(false)
        setShowDetailsModal(false)
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
      const response = await axios.post(`${API_BASE}/admin/wallet/topup-requests/${requestId}/reject`, {
        rejected_reason: reason,
        admin_notes: notes
      })
      
      if (response.data.success) {
        showSuccessAlert('Top-up request rejected')
        loadTopUpRequests()
        loadDashboardStats()
        setShowRejectModal(false)
        setShowDetailsModal(false)
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
        admin_notes: notes
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
    setProgress(50)
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const response = await axios.get(`${API_BASE}/admin/wallet/export-topup-requests?${params}`)
      if (response.data.success) {
        window.open(response.data.data.download_url, '_blank')
        showSuccessAlert('Export completed successfully')
      }
    } catch (error) {
      showErrorAlert('Export failed')
    } finally {
      setProgress(100)
    }
  }

  const handleDownloadReceipt = (receiptPath) => {
    if (receiptPath) {
      const receiptUrl = `${axios.defaults.imageUrl}/${receiptPath}`
      window.open(receiptUrl, '_blank')
    }
  }

  const getReceiptUrl = (receiptPath) => {
    if (!receiptPath) return null
    return `${axios.defaults.imageUrl}/${receiptPath}`
  }

  const isImageFile = (filename) => {
    if (!filename) return false
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return imageExtensions.some(ext => filename.toLowerCase().includes(ext))
  }

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#28a745'
    })
  }

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#dc3545'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: Clock },
      approved: { color: 'success', icon: CheckCircle },
      rejected: { color: 'danger', icon: XCircle },
      cancelled: { color: 'secondary', icon: Slash }
    }
    
    const config = statusConfig[status] || { color: 'secondary', icon: Clock }
    const IconComponent = config.icon
    
    return (
      <CBadge color={config.color} className="d-flex align-items-center gap-1">
        <IconComponent size={14} />
        {status?.toUpperCase()}
      </CBadge>
    )
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank_transfer: Bank,
      credit_card: CreditCard,
      paypal: CashCoin,
      mobile_payment: Wallet
    }
    return icons[method] || CurrencyDollar
  }

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', LKR: 'Rs.' }
    return `${symbols[currency] || currency} ${parseFloat(amount).toLocaleString()}`
  }

  // Material Table Data Configuration
  const topUpRequestsTableData = {
    columns: [
      {
        title: 'Request ID',
        field: 'id',
        width: 100,
        render: rowData => `#${rowData.id}`
      },
      {
        title: 'Customer',
        field: 'customer',
        render: rowData => (
          <div>
            <div className="fw-bold">{rowData.customer?.name || rowData.user?.username || 'N/A'}</div>
            <small className="text-muted">{rowData.user?.email || rowData.customer?.customer_email || 'N/A'}</small>
          </div>
        )
      },
      {
        title: 'Amount',
        field: 'amount',
        render: rowData => (
          <div className="fw-bold text-success">
            {formatCurrency(rowData.amount, rowData.currency)}
          </div>
        )
      },
      {
        title: 'Payment Method',
        field: 'payment_method',
        render: rowData => {
          const IconComponent = getPaymentMethodIcon(rowData.payment_method)
          return (
            <div className="d-flex align-items-center gap-2">
              <IconComponent size={16} />
              {rowData.payment_method?.replace('_', ' ')?.toUpperCase()}
            </div>
          )
        }
      },
      {
        title: 'Reference',
        field: 'payment_reference',
        width: 150
      },
      {
        title: 'Receipt',
        field: 'payment_slip',
        sorting: false,
        render: rowData => (
          rowData.payment_slip_path ? (
            <CTooltip content="View Receipt">
              {console.log(rowData,"Row Data daaaaaaaa")}
              <CButton 
                size="sm" 
                color="info" 
                variant="outline"
                onClick={() => handleDownloadReceipt(rowData.payment_slip_path)}
              >
                <FileEarmarkImage size={16} />
              </CButton>
            </CTooltip>
          ) : (
            <span className="text-muted">No receipt</span>
          )
        )
      },
      {
        title: 'Status',
        field: 'status',
        render: rowData => getStatusBadge(rowData.status)
      },
      {
        title: 'Submitted',
        field: 'created_at',
        render: rowData => new Date(rowData.created_at).toLocaleDateString()
      },
      {
        title: 'Actions',
        field: 'actions',
        sorting: false,
        export: false,
        render: rowData => (
          <div className="d-flex gap-1">
            <CTooltip content="View Details">
              <CButton 
                size="sm" 
                color="info" 
                variant="outline"
                onClick={() => loadRequestDetails(rowData.id)}
              >
                <Eye size={16} />
              </CButton>
            </CTooltip>
            
            {rowData.status === 'pending' && (
              <>
                <CTooltip content="Approve">
                  <CButton 
                    size="sm" 
                    color="success" 
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(rowData)
                      setShowApproveModal(true)
                    }}
                  >
                    <CheckCircle size={16} />
                  </CButton>
                </CTooltip>
                
                <CTooltip content="Reject">
                  <CButton 
                    size="sm" 
                    color="danger" 
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(rowData)
                      setShowRejectModal(true)
                    }}
                  >
                    <XCircle size={16} />
                  </CButton>
                </CTooltip>
              </>
            )}
          </div>
        )
      }
    ],
    rows: topUpRequests
  }

  const walletsTableData = {
    columns: [
      {
        title: 'Wallet ID',
        field: 'id',
        width: 100,
        render: rowData => `#${rowData.id}`
      },
      {
        title: 'Customer',
        field: 'customer',
        render: rowData => (
          <div>
            <div className="fw-bold">{rowData.customer?.name || rowData.user?.username || 'N/A'}</div>
            <small className="text-muted">{rowData.user?.email || rowData.customer?.customer_email || 'N/A'}</small>
          </div>
        )
      },
      {
        title: 'Status',
        field: 'status',
        render: rowData => getStatusBadge(rowData.status)
      },
      {
        title: 'Created',
        field: 'created_at',
        render: rowData => new Date(rowData.created_at).toLocaleDateString()
      },
      {
        title: 'Actions',
        field: 'actions',
        sorting: false,
        export: false,
        render: rowData => (
          <CButton 
            size="sm" 
            color="primary" 
            variant="outline"
            onClick={() => {
              // Handle wallet details view
            }}
          >
            <Eye size={16} />
          </CButton>
        )
      }
    ],
    rows: wallets
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <LoadingBar color="#58c67d" progress={progress} onLoaderFinished={() => setProgress(0)} height={5} />

      {/* Dashboard Stats */}
      {/* <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-3"
            color="primary"
            inverse
            value={dashboardStats.wallet_stats.total}
            title="Total Wallets"
            progress={{ color: 'success', value: 75 }}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-3"
            color="info"
            inverse
            value={dashboardStats.request_stats.pending}
            title="Pending Requests"
            progress={{ color: 'warning', value: 45 }}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-3"
            color="warning"
            inverse
            value={dashboardStats.request_stats.approved}
            title="Approved Today"
            progress={{ color: 'success', value: 85 }}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-3"
            color="success"
            inverse
            value={`Rs. ${dashboardStats.amount_stats.total_approved_lkr.toLocaleString()}`}
            title="Total Approved (LKR)"
            progress={{ color: 'info', value: 95 }}
          />
        </CCol>
      </CRow> */}

      {/* Main Content Card */}
      <CCard className="mb-4">
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">Wallet Management</h4>
            </CCol>
            <CCol xs="auto">
              <CButtonGroup>
                <CButton 
                  color="primary" 
                  variant="outline"
                  active={activeTab === 'requests'}
                  onClick={() => setActiveTab('requests')}
                >
                  Top-up Requests
                </CButton>
                <CButton 
                  color="primary" 
                  variant="outline"
                  active={activeTab === 'wallets'}
                  onClick={() => setActiveTab('wallets')}
                >
                  Wallets
                </CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          {/* Filters Section */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormSelect
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormSelect
                value={filters.payment_method}
                onChange={(e) => setFilters({...filters, payment_method: e.target.value})}
              >
                <option value="">All Payment Methods</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="mobile_payment">Mobile Payment</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>
                  <Search size={16} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search by name, email, or reference..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </CInputGroup>
            </CCol>
            <CCol md={2}>
              <CButtonGroup>
                <CButton color="info" onClick={loadTopUpRequests}>
                  <ArrowClockwise size={16} />
                </CButton>
                <CButton color="success" onClick={handleExport}>
                  <Download size={16} />
                </CButton>
              </CButtonGroup>
            </CCol>
          </CRow>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && activeTab === 'requests' && (
            <CAlert color="info" className="d-flex justify-content-between align-items-center">
              <span>{selectedRequests.length} requests selected</span>
              <CButton 
                color="success" 
                size="sm"
                onClick={() => setShowBulkModal(true)}
              >
                Bulk Approve
              </CButton>
            </CAlert>
          )}

          {/* Material Table */}
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              title=""
              data={activeTab === 'requests' ? topUpRequestsTableData.rows : walletsTableData.rows}
              columns={activeTab === 'requests' ? topUpRequestsTableData.columns : walletsTableData.columns}
              options={{
                sorting: true,
                search: false,
                filtering: false,
                paging: true,
                pageSizeOptions: [10, 20, 50, 100],
                pageSize: 20,
                paginationType: "stepped",
                showFirstLastPageButtons: true,
                paginationPosition: "both",
                exportButton: false,
                selection: activeTab === 'requests',
                showSelectAllCheckbox: activeTab === 'requests',
                grouping: false,
                columnsButton: true,
                headerStyle: {
                  background: '#18181aff',
                  color: "#fff",
                  padding: "15px",
                  fontSize: "16px",
                  fontWeight: '600'
                },
                rowStyle: rowData => ({
                  fontSize: "14px",
                  backgroundColor: rowData.status === 'rejected' ? '#ffebee' : 
                                 rowData.status === 'approved' ? '#e8f5e8' : ''
                })
              }}
              onSelectionChange={(rows) => {
                setSelectedRequests(rows.map(row => row.id))
              }}
            />
          </ThemeProvider>
        </CCardBody>
      </CCard>

      {/* Request Details Modal */}
      <CModal visible={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Top-up Request Details - #{requestDetails?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {requestDetails && (
            <CRow>
              <CCol md={6}>
                <h6 className="mb-3">Customer Information</h6>
                <div className="mb-2">
                  <strong>Name:</strong> {requestDetails.customer?.name || requestDetails.user?.username || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {requestDetails.user?.email || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>Customer Email:</strong> {requestDetails.customer?.customer_email || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>Contact:</strong> {requestDetails.customer?.contact_number || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>User ID:</strong> #{requestDetails.user_id}
                </div>
                <div className="mb-2">
                  <strong>Nationality:</strong> {requestDetails.customer?.customer_nationality || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>Address:</strong> {requestDetails.customer?.customer_address || 'N/A'}
                </div>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-3">Payment Information</h6>
                <div className="mb-2">
                  <strong>Amount:</strong> {formatCurrency(requestDetails.amount, requestDetails.currency)}
                </div>
                <div className="mb-2">
                  <strong>Method:</strong> {requestDetails.payment_method?.replace('_', ' ')?.toUpperCase()}
                </div>
                <div className="mb-2">
                  <strong>Reference:</strong> {requestDetails.payment_reference}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong> {getStatusBadge(requestDetails.status)}
                </div>
                <div className="mb-2">
                  <strong>Submitted:</strong> {new Date(requestDetails.submitted_at).toLocaleString()}
                </div>
                {requestDetails.verified_at && (
                  <div className="mb-2">
                    <strong>Verified:</strong> {new Date(requestDetails.verified_at).toLocaleString()}
                  </div>
                )}
                
                {/* Bank Transfer Details */}
                {requestDetails.payment_method === 'bank_transfer' && requestDetails.bank_details && (
                  <>
                    <h6 className="mb-3 mt-4">Bank Transfer Details</h6>
                    <div className="mb-2">
                      <strong>Bank Name:</strong> {requestDetails.bank_details.bank_name || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Account Number:</strong> {requestDetails.bank_details.account_number || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Transfer Date:</strong> {requestDetails.bank_details.transfer_date || 'N/A'}
                    </div>
                  </>
                )}
                
                {/* Payment Receipt */}
                {requestDetails.payment_slip && (
                  <>
                    <h6 className="mb-3 mt-4">Payment Receipt</h6>
                    <div className="mb-3">
                      <strong>File:</strong> {requestDetails.payment_slip.original_name || 'Receipt'}
                    </div>
                    <div className="d-flex gap-2 mb-3">
                      <CButton 
                        color="primary" 
                        size="sm"
                        onClick={() => window.open(getReceiptUrl(requestDetails.payment_slip.path), '_blank')}
                      >
                        <CloudDownload size={16} className="me-1" />
                        Download Receipt
                      </CButton>
                      {isImageFile(requestDetails.payment_slip.original_name) && (
                        <CButton 
                          color="info" 
                          size="sm"
                          onClick={() => setShowReceiptModal(true)}
                        >
                          <Eye size={16} className="me-1" />
                          View Receipt
                        </CButton>
                      )}
                    </div>
                    
                    {/* Preview for images */}
                    {isImageFile(requestDetails.payment_slip.original_name) && (
                      <div className="mt-3">
                        <CImage 
                          src={getReceiptUrl(requestDetails.payment_slip.path)}
                          alt="Payment Receipt Preview"
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                          className="border rounded"
                        />
                      </div>
                    )}
                  </>
                )}
                
                {/* Admin Notes */}
                {requestDetails.admin_notes && (
                  <>
                    <h6 className="mb-3 mt-4">Admin Notes</h6>
                    <div className="mb-2 p-2 bg-light rounded">
                      {requestDetails.admin_notes}
                    </div>
                  </>
                )}
                
                {/* Rejection Reason */}
                {requestDetails.rejected_reason && (
                  <>
                    <h6 className="mb-3 mt-4">Rejection Reason</h6>
                    <div className="mb-2 p-2 bg-danger-subtle text-danger rounded">
                      {requestDetails.rejected_reason}
                    </div>
                  </>
                )}
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          {requestDetails?.status === 'pending' && (
            <div className="d-flex gap-2">
              <CButton 
                color="success" 
                onClick={() => {
                  setShowDetailsModal(false)
                  setShowApproveModal(true)
                }}
              >
                <CheckCircle size={16} className="me-1" />
                Approve
              </CButton>
              <CButton 
                color="danger" 
                onClick={() => {
                  setShowDetailsModal(false)
                  setShowRejectModal(true)
                }}
              >
                <XCircle size={16} className="me-1" />
                Reject
              </CButton>
            </div>
          )}
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Receipt Modal */}
      <CModal visible={showReceiptModal} onClose={() => setShowReceiptModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Payment Receipt - #{requestDetails?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          {requestDetails?.payment_slip && isImageFile(requestDetails.payment_slip.original_name) && (
            <CImage 
              src={getReceiptUrl(requestDetails.payment_slip.path)}
              alt="Payment Receipt"
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              className="border rounded"
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="primary" 
            onClick={() => window.open(getReceiptUrl(requestDetails?.payment_slip?.path), '_blank')}
          >
            <CloudDownload size={16} className="me-1" />
            Download Full Size
          </CButton>
          <CButton color="secondary" onClick={() => setShowReceiptModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Approve Modal */}
      <CModal visible={showApproveModal} onClose={() => setShowApproveModal(false)}>
        <CModalHeader>
          <CModalTitle>Approve Request #{selectedRequest?.id || requestDetails?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes about this approval..."
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="success" 
            onClick={() => handleApproveRequest(selectedRequest?.id || requestDetails?.id, adminNotes)}
          >
            Approve Request
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Reject Modal */}
      <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <CModalHeader>
          <CModalTitle>Reject Request #{selectedRequest?.id || requestDetails?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Rejection Reason *</CFormLabel>
            <CFormTextarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              required
            />
            <CFormLabel className="mt-3">Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="danger" 
            onClick={() => handleRejectRequest(selectedRequest?.id || requestDetails?.id, rejectionReason, adminNotes)}
            disabled={!rejectionReason.trim()}
          >
            Reject Request
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Bulk Approve Modal */}
      <CModal visible={showBulkModal} onClose={() => setShowBulkModal(false)}>
        <CModalHeader>
          <CModalTitle>Bulk Approve Requests</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>You are about to approve {selectedRequests.length} requests.</p>
          <CForm>
            <CFormLabel>Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes for all approved requests..."
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowBulkModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="success" 
            onClick={() => handleBulkApprove(selectedRequests, adminNotes)}
          >
            Approve All
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default WalletTransactions