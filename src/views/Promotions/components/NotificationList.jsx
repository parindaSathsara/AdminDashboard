import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
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
  CAvatar,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

function NotificationList() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/promotions/notifications/paginate', {
        params: { page, per_page: perPage },
      })

      const { data, last_page } = response.data.notification
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
  }, [page, perPage])

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <CBadge color="success">Success</CBadge>
    ) : (
      <CBadge color="danger">Failed</CBadge>
    )
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
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
      <CCardBody>
        {loading ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <CTable hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Content</CTableHeaderCell>
                  <CTableHeaderCell>Topic</CTableHeaderCell>
                  <CTableHeaderCell>Users</CTableHeaderCell>
                  <CTableHeaderCell>Total Device</CTableHeaderCell>
                  <CTableHeaderCell>Success Device</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Sent At</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {notifications.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>
                      {item.image ? <CAvatar src={item.image} size="md" /> : item.title}
                    </CTableDataCell>
                    <CTableDataCell>{item.content || '-'}</CTableDataCell>
                    <CTableDataCell title={item.topic.description}>
                      {item.topic.topic}
                    </CTableDataCell>
                    <CTableDataCell>{item.total_users.toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{item.topic.total_devices.toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{item.topic.success_devices.toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      {item.is_success === 1 ? (
                        <CIcon icon={cilCheckCircle} className="text-success" />
                      ) : (
                        <CIcon icon={cilXCircle} className="text-danger" />
                      )}{' '}
                      {getStatusBadge(item.is_success)}
                    </CTableDataCell>
                    <CTableDataCell>{new Date(item.created_at).toLocaleString()}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <CPagination align="center">
                <CPaginationItem
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <CPaginationItem
                    key={i + 1}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default NotificationList
