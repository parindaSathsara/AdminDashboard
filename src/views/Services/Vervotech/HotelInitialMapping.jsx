import React, { useEffect, useMemo, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CForm,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CBadge,
  CTooltip,
} from '@coreui/react'
import VervotechTabs from './VervotechTabs'
import axios from 'axios'

const HotelInitialMapping = () => {
  // Form state
  const [provider, setProvider] = useState('')
  const providers = useMemo(
    () => [
      { label: 'Select provider', value: '' },
      { label: 'TBOindia', value: 'TBOindia' },
      { label: 'TBOGlobal', value: 'TBOGlobal' },
      { label: 'RateHawk', value: 'RateHawk' },
      { label: 'SiteMinder', value: 'SiteMinder' },
    ],
    [],
  )

  // List state
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)

  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const fetchList = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get('vervotech/mapping/all', {
        params: { page, per_page: perPage },
      })
      // Expecting a structure; fallback safely if unknown
      const data = res?.data || {}
      const list = data?.data?.data || []
      console.log('Umayanga', list)

      setItems(Array.isArray(list) ? list : [])
      setTotal(Number(data?.total || data?.count || list.length || 0))
    } catch (e) {
      setError('Failed to load mappings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const onCreate = (e) => {
    e.preventDefault()
    if (!provider) return
    // Submit logic will be implemented later
    // Placeholder: show a quick feedback via console
    console.log('Create initial mapping with provider:', provider)
  }

  // helpers
  const fmt = (d) => {
    if (!d) return '-'
    try {
      return new Date(d).toLocaleString()
    } catch (e) {
      return String(d)
    }
  }

  const copyText = async (text, label = 'Text') => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(String(text))
      // Show toast or add animation for feedback
      const el = document.getElementById('copy-notification')
      if (el) {
        el.textContent = `${label} copied!`
        el.classList.add('show')
        setTimeout(() => el.classList.remove('show'), 2000)
      }
    } catch (e) {
      console.log('Copy failed:', e)
    }
  }

  // Function to truncate long text
  const truncate = (text, maxLength = 120) => {
    if (!text) return ''
    const str = String(text)
    return str.length > maxLength ? str.slice(0, maxLength) + '…' : str
  }

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="p-3">
          <VervotechTabs />
          <h3 className="mb-3">Hotel Initial Mapping Sync</h3>

          {/* Create form */}
          <CForm className="mb-4" onSubmit={onCreate}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6 col-lg-4">
                <CFormLabel htmlFor="provider">Provider</CFormLabel>
                <CFormSelect
                  id="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  {providers.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <CButton type="submit" color="primary" disabled={!provider}>
                  Create Initial Mapping
                </CButton>
              </div>
            </div>
          </CForm>
          {/* List header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Created Initial Mappings</h5>
          </div>

          {/* Copy notification */}
          <div
            id="copy-notification"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              background: '#28a745',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              transition: 'opacity 0.3s',
              opacity: 0,
              zIndex: 1050,
            }}
            className=""
          >
            Text copied!
          </div>

          {/* Cards list */}
          <div className="d-flex flex-column gap-4">
            {loading && (
              <div className="text-center py-4">
                <CSpinner color="primary" />
                <div className="mt-2">Loading mappings...</div>
              </div>
            )}

            {!loading && error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle-fill me-2"></i>
                No mapping records found. Create a new mapping using the form above.
              </div>
            )}

            {!loading &&
              !error &&
              items.map((item, idx) => {
                const serial = (page - 1) * perPage + idx + 1
                const statusVariant =
                  item.status === 'completed'
                    ? 'success'
                    : item.status === 'failed'
                    ? 'danger'
                    : 'warning'

                return (
                  <div key={item.id || idx} className="card border-0 shadow">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
                      <div className="d-flex align-items-center">
                        <CBadge color="dark" className="me-2">
                          #{item.id ?? '-'}
                        </CBadge>
                        <CBadge color="info" className="me-2 text-dark">
                          {item.provider || '-'}
                        </CBadge>
                        <small className="text-muted ms-2">Item {serial}</small>
                      </div>
                      <CBadge color={statusVariant}>{item.status || 'Unknown'}</CBadge>
                    </div>

                    <div className="card-body">
                      {/* Stats Section */}
                      <div className="row g-3 mb-3">
                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <i className="bi bi-gear-fill me-1"></i> Limit
                          </div>
                          <div className="fw-bold h5 mb-0">{item.limit ?? '-'}</div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <i className="bi bi-building-add me-1"></i> New Hotels
                          </div>
                          <div className="fw-bold h5 mb-0">{item.processed_new_hotels ?? '-'}</div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <i className="bi bi-card-list me-1"></i> Records
                          </div>
                          <div className="fw-bold h5 mb-0">{item.processed_records ?? '-'}</div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <i className="bi bi-arrow-repeat me-1"></i> Circles
                          </div>
                          <div className="fw-bold h5 mb-0">{item.processed_circles ?? '-'}</div>
                        </div>
                      </div>

                      {/* Timestamps Section */}
                      <div className="card bg-light mb-3">
                        <div className="card-body py-2">
                          <div className="row g-3">
                            <div className="col-6 col-md-4">
                              <div className="text-muted small mb-1">
                                <i className="bi bi-clock-history me-1"></i> Last Update
                              </div>
                              <div>{fmt(item.last_update_date_time)}</div>
                            </div>

                            <div className="col-6 col-md-4">
                              <div className="text-muted small mb-1">
                                <i className="bi bi-calendar-plus me-1"></i> Created
                              </div>
                              <div>{fmt(item.created_at)}</div>
                            </div>

                            <div className="col-6 col-md-4">
                              <div className="text-muted small mb-1">
                                <i className="bi bi-calendar-check me-1"></i> Updated
                              </div>
                              <div>{fmt(item.updated_at)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resume Keys Section */}
                      <div className="row g-3">
                        {/* Current Resume Key */}
                        <div className="col-12">
                          <div className="text-muted small mb-1">
                            <i className="bi bi-key-fill me-1"></i> Current Resume Key
                          </div>
                          {item.current_resume_key ? (
                            <div className="d-flex">
                              <code
                                className="flex-grow-1 p-2 bg-light border rounded text-wrap"
                                style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}
                              >
                                {truncate(item.current_resume_key)}
                              </code>
                              <CTooltip content="Copy to clipboard">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary ms-2"
                                  onClick={() =>
                                    copyText(item.current_resume_key, 'Current Resume Key')
                                  }
                                >
                                  <i className="bi bi-clipboard"></i>
                                </button>
                              </CTooltip>
                            </div>
                          ) : (
                            <div className="text-muted fst-italic">
                              No current resume key available
                            </div>
                          )}
                        </div>

                        {/* Next Resume Key */}
                        <div className="col-12">
                          <div className="text-muted small mb-1">
                            <i className="bi bi-key me-1"></i> Next Resume Key
                          </div>
                          {item.next_resume_key ? (
                            <div className="d-flex">
                              <code
                                className="flex-grow-1 p-2 bg-light border rounded text-wrap"
                                style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}
                              >
                                {truncate(item.next_resume_key)}
                              </code>
                              <CTooltip content="Copy to clipboard">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary ms-2"
                                  onClick={() => copyText(item.next_resume_key, 'Next Resume Key')}
                                >
                                  <i className="bi bi-clipboard"></i>
                                </button>
                              </CTooltip>
                            </div>
                          ) : (
                            <div className="text-muted fst-italic">
                              No next resume key available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

            {/* Pagination controls */}
            {!loading && !error && items.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing page {page} of {Math.max(1, totalPages)} • {total} total items
                </div>

                <nav aria-label="Mapping pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        &laquo; Previous
                      </button>
                    </li>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Center current page in pagination window
                      const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                      const pageNum = start + i
                      if (pageNum > totalPages) return null

                      return (
                        <li
                          key={pageNum}
                          className={`page-item ${pageNum === page ? 'active' : ''}`}
                        >
                          <button className="page-link" onClick={() => setPage(pageNum)}>
                            {pageNum}
                          </button>
                        </li>
                      )
                    })}

                    <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HotelInitialMapping
