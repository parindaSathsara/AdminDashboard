import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CButton,
  CFormInput,
  CInputGroup,
} from '@coreui/react'
import axios from 'axios'
import './Education.css'

const Education = () => {
  const [educationData, setEducationData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [isLastPage, setIsLastPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchEducationData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `/getCustomerEduReq?page=${currentPage}`,
      )
      const { data, last_page } = response.data

      if (Array.isArray(data)) {
        setEducationData((prevData) => [...prevData, ...data])
        setFilteredData((prevData) => [...prevData, ...data])
        setIsLastPage(last_page)
      } else {
        setError('Invalid data received from the server.')
      }
    } catch (error) {
      console.error('Error fetching education data:', error)
      setError('Failed to load education data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEducationData()
  }, [currentPage])

  const handleOpenModal = (item) => {
    setSelectedItem(item)
    setActiveId(item.id)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
    setActiveId(null)
  }

  const getNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const searchValue = e.target.search.value.toLowerCase()
    setSearchTerm(searchValue)

    if (searchValue.trim() === '') {
      setFilteredData(educationData)
      return
    }

    const filtered = educationData.filter(item => 
      item.edu_category.toLowerCase().includes(searchValue) ||
      item.edu_description.toLowerCase().includes(searchValue) ||
      item.username?.toLowerCase().includes(searchValue) ||
      item.email?.toLowerCase().includes(searchValue)
    )
    
    setFilteredData(filtered)
  }

  const truncateText = (text, wordLimit = 10) => {
    const words = text.split(' ')
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'
    }
    return text
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50 text-danger">
        {error}
      </div>
    )
  }

  return (
    <div className="education-container">
      <h2 className="mb-4 text-center">Education List</h2>
      
      {/* Search Bar */}
      <CRow className="justify-content-center mb-4">
        <CCol xs="12" md="6">
          <form onSubmit={handleSearch}>
            <CInputGroup>
              <CFormInput
                name="search"
                placeholder="Search by category, description, username or email..."
                defaultValue={searchTerm}
              />
              <CButton type="submit" color="primary">
                Search
              </CButton>
              {searchTerm && (
                <CButton 
                  color="secondary" 
                  onClick={() => {
                    setSearchTerm('')
                    setFilteredData(educationData)
                    document.querySelector('input[name="search"]').value = ''
                  }}
                >
                  Clear
                </CButton>
              )}
            </CInputGroup>
          </form>
        </CCol>
      </CRow>

      {loading && (
        <div className="d-flex justify-content-center align-items-center vh-50">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div className="cards-grid">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <CRow key={item.id} className="justify-content-center">
              <CCol xs="12" md="8" style={{width:"90%"}}>
                <CCard
                  className={`notification-card ${activeId === item.id ? 'active' : ''}`}
                  onClick={() => handleOpenModal(item)}
                >
                  <CCardBody>
                    <CRow>
                      <CCol xs="12" className="text-left">
                        <h5 className="notification-title">{item.edu_category}</h5>
                        <p className="notification-description">
                          {truncateText(item.edu_description)}
                        </p>
                        <small className="notification-date text-muted">
                          {new Date(item.created_at).toLocaleDateString()}
                        </small>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          ))
        ) : (
          <div className="text-center mt-4">
            <p>No results found</p>
          </div>
        )}

        {!isLastPage && !loading && !searchTerm && (
          <div className="d-flex justify-content-center mt-4">
            <CButton color="secondary" variant="outline" onClick={getNextPage}>
              Load more
            </CButton>
          </div>
        )}
      </div>

      {selectedItem && (
        <CModal visible={!!selectedItem} onClose={handleCloseModal} size="lg" className="modal">
          <CModalHeader closeButton>
            <h5>{selectedItem.edu_category}</h5>
          </CModalHeader>
          <CModalBody>
            <p>
              <strong>Description:</strong> {selectedItem.edu_description}
            </p>
            <p>
              <strong>Username:</strong> {selectedItem.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedItem.email}
            </p>
            <p>
              <strong>Status:</strong> {selectedItem.user_status}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(selectedItem.created_at).toLocaleString()}
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleCloseModal}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default Education