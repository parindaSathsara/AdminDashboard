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
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGear,
  faBuildingCircleArrowRight,
  faListCheck,
  faArrowsSpin,
  faClock,
  faCalendarPlus,
  faCalendarCheck,
  faKey,
  faClipboard,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'

const HotelInitialMapping = () => {
  // Form state
  const [provider, setProvider] = useState('')
  const providers = useMemo(
    () => [
      { label: 'Select provider', value: '' },
      { label: 'TBOindia', value: 'TBOindia' },
      { label: 'TBOGlobal', value: 'TBOGlobal' },
      { label: 'RateHawk', value: 'RateHawk' },
      { label: 'LevelTravel', value: 'LevelTravel' },
      { label: 'ActivityLinker', value: 'ActivityLinker' },
      { label: 'DiscoverQatar', value: 'DiscoverQatar' },
    ],
    [],
  )

  // List state
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)

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

  const onCreate = async (e) => {
    e.preventDefault()
    if (!provider) return
    try {
      setCreating(true)
      // call create endpoint
      const res = await axios.post('vervotech/mapping/create', { provider })
      // show success swal
      await Swal.fire({
        icon: 'success',
        title: 'Created',
        text: 'Initial mapping created successfully',
        timer: 1800,
        showConfirmButton: false,
      })

      // refresh list to include the newly created mapping
      await fetchList()
      // optionally reset provider selection
      setProvider('')
    } catch (err) {
      console.error('Error creating mapping:', err)
      Swal.fire({
        icon: 'error',
        title: 'Create failed',
        text: err?.response?.data?.message || 'Could not create mapping',
      })
    } finally {
      setCreating(false)
    }
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
            <h5 className="mb-0">Created Initial Mappings ({total})</h5>
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
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {error}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="alert alert-info">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
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
                  <div key={item.id || idx} className="card border">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
                      <div className="d-flex align-items-center">
                        <CBadge color="dark" className="me-2">
                          #{item.id ?? '-'}
                        </CBadge>
                        <CBadge color="info" className="me-2 text-light">
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
                            <FontAwesomeIcon icon={faGear} className="me-1" /> Limit
                          </div>
                          <div className="fw-bold h5 mb-0">{item.limit ?? '-'}</div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <FontAwesomeIcon icon={faBuildingCircleArrowRight} className="me-1" />{' '}
                            New Hotels
                          </div>
                          <div className="fw-bold h5 mb-0">{item.processed_new_hotels ?? '-'}</div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <FontAwesomeIcon icon={faListCheck} className="me-1" /> Records
                          </div>
                          <div className="fw-bold h5 mb-0">{item.processed_records ?? '-'}</div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div className="text-muted small mb-1">
                            <FontAwesomeIcon icon={faArrowsSpin} className="me-1" /> Circles
                          </div>
                          <div className="fw-bold h5 mb-0">{item.processed_circles ?? '-'}</div>
                        </div>
                      </div>

                      {/* Timestamps Section */}
                      <div className="card border mb-3">
                        <div className="card-body py-2">
                          <div className="row g-3">
                            <div className="col-6 col-md-4">
                              <div className="text-muted small mb-1">
                                <FontAwesomeIcon icon={faClock} className="me-1" /> Last Update
                              </div>
                              <div>{fmt(item.last_update_date_time)}</div>
                            </div>

                            <div className="col-6 col-md-4">
                              <div className="text-muted small mb-1">
                                <FontAwesomeIcon icon={faCalendarPlus} className="me-1" /> Created
                              </div>
                              <div>{fmt(item.created_at)}</div>
                            </div>

                            <div className="col-6 col-md-4">
                              <div className="text-muted small mb-1">
                                <FontAwesomeIcon icon={faCalendarCheck} className="me-1" /> Updated
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
                            <FontAwesomeIcon icon={faKey} className="me-1" /> Current Resume Key
                          </div>
                          {item.current_resume_key ? (
                            <div className="d-flex">
                              <code
                                className="flex-grow-1 p-2 border rounded text-wrap"
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
                                  <FontAwesomeIcon icon={faClipboard} />
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
                            <FontAwesomeIcon icon={faKey} className="me-1" /> Next Resume Key
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
                                  <FontAwesomeIcon icon={faClipboard} />
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
          </div>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HotelInitialMapping
