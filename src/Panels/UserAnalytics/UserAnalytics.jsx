import React, { useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow, CSpinner } from '@coreui/react'
import CustomerSearch from './CustomerSearch'
import { useState } from 'react'
import './UserAnalytics.css'
import axios from 'axios'
import ProductChart from './ProductChart'
import Category_Insights_Chart from './Category_Insights_Chart'

const UserAnalytics = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [totalTriggers, setTotalTriggers] = useState('Not Available')
  const [topClickedProducts, setTopClickedProducts] = useState(null)
  const [topClickedCategories, setTopClickedCategories] = useState(null)
  const [Loading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedUser && selectedUser.customer_id) {
      getTotalTriggers(selectedUser.customer_id)
      getTopClickedProducts(selectedUser.customer_id)
      getTopClickedCategories(selectedUser.customer_id)
    } else {
      setTotalTriggers('Not Available')
      setTopClickedProducts(null)
      setTopClickedCategories(null)
    }
  }, [selectedUser])

  async function getTotalTriggers(id) {
    try {
      const response = await axios.get(`/getClickCount/${id}`)
      setTotalTriggers(response.data)
    } catch (error) {
      setTotalTriggers('Not Available')
      console.error('Error fetching trigger count:', error)
    }
  }

  async function getTopClickedProducts(id) {
    try {
      setIsLoading(true)
      const response = await axios.get(`/topClickedProducts/${id}`)
      setIsLoading(false)
      setTopClickedProducts(response.data)
    } catch (error) {
      setIsLoading(false)
      setTopClickedProducts(null)
      console.error('Error fetching products:', error)
    }
  }

  async function getTopClickedCategories(id) {
    try {
      const response = await axios.get(`/getTopClickedCategories/${id}`)
      setTopClickedCategories(response.data)
    } catch (error) {
      setTopClickedCategories(null)
      console.error('Error fetching Categories:', error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol >
                <h4 className="text-2xl font-bold"> Customer Analytics Dashboard</h4>
              </CCol>

              <CCol>
                <CustomerSearch setSelectedUser={setSelectedUser} setIsLoading={setIsLoading} />
              </CCol>
            </CRow>
          </CCardHeader>
        </CCard>

        {/* <div class="searchBarContainer">
          <CustomerSearch setSelectedUser={setSelectedUser} setIsLoading={setIsLoading} />
        </div> */}

        {selectedUser === null ? ( // Render nothing if selectedUser is null
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: '2%',
            }}
          >
            <h5>Search customers to get customer analytics...</h5>
          </div>
        ) : null}

        {Loading && (
          <div className="spinnerContainer">
            <CSpinner color="danger" style={{ width: '4rem', height: '4rem' }} />
          </div>
        )}

        {selectedUser && (
          <CContainer fluid>
            <br />
            <div className="mainCardContainer">
              <CCol xs={12} lg={3}>
                <CCard className="h-100 shadow-sm">
                  <CCardHeader className="text-white" style={{ backgroundColor: '#004e64' }}>
                    <h5 className="mb-0">CUSTOMER DETAILS</h5>
                  </CCardHeader>
                  <CCardBody>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        ID:
                      </span>
                      <span className="detailValue">{selectedUser.id}</span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        Name:
                      </span>
                      <span className="detailValue">{selectedUser.customer_fname}</span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        Country:
                      </span>
                      <span className="detailValue">
                        {selectedUser.customer_nationality || 'Not Specified'}
                      </span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        Telephone:
                      </span>
                      <span className="detailValue">
                        {selectedUser.contact_number || 'Not Specified'}
                      </span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        E-mail:
                      </span>
                      <span className="detailValue">
                        {selectedUser.customer_email || 'Not Specified'}
                      </span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        Address:
                      </span>
                      <span className="detailValue">
                        {selectedUser.customer_address || 'Not Specified'}
                      </span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        Status:
                      </span>
                      <span className="detailValue">
                        {selectedUser.customer_status || 'Unavailable'}
                      </span>
                    </div>
                    <div className="card-item d-flex justify-content-between py-2">
                      <span className="fw-bold" style={{ color: '#004e64' }}>
                        Total Clicks:
                      </span>
                      <span className="detailValue">{totalTriggers}</span>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} lg={9}>
                {topClickedProducts && (
                  <>
                    <CCard style={{ marginBottom: '5px' }}>
                      <CCardHeader style={{ backgroundColor: '#004e64', color: 'white' }}>
                        Top Searches
                      </CCardHeader>
                      <CCardBody className="analyticaCardBody">
                        <h3>Top 5 Products</h3>
                        <ProductChart data={topClickedProducts} />
                      </CCardBody>
                    </CCard>
                  </>
                )}
                {topClickedCategories && (
                  <>
                    <CCard>
                      <CCardBody className="analyticaCardBody">
                        <h3>Category Insights</h3>
                        <Category_Insights_Chart apiData={topClickedCategories} />
                      </CCardBody>
                    </CCard>
                  </>
                )}
              </CCol>
            </div>
          </CContainer>
        )}
      </div>
    </div>
  )
}

export default UserAnalytics
