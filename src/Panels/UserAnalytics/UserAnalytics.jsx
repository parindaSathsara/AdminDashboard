import React from 'react'
import { CButton, CCard, CCardBody, CCardTitle, CCol, CContainer, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilSearch, cilSettings } from '@coreui/icons'
import { FaDownload, FaEllipsisV, FaEye } from 'react-icons/fa'
import CustomerSearch from './CustomerSearch'
import { useState } from 'react'
import './UserAnalytics.css'





const UserAnalytics = () => {
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedCustomerData,setSelectedCustomerData] = useState(null);

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div class="searchBarContainer">
          <CustomerSearch setSelectedUserId={setSelectedUserId} />
        </div>

        {/* <div>
          <CCard className="mb-6">
            <CCardBody className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="h-[300px] w-full bg-gray-50 rounded-lg">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Chart Area
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <CButton variant="outline" className="flex items-center gap-2">
                  <FaDownload className="h-4 w-4" />
                  Download Report
                </CButton>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">+5.4%</span>
                  <span className="text-gray-500">All Time High</span>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </div> */}
        <CContainer>
          <CRow>
            <CCol>1 of 3</CCol>
            <CCol xs lg={2}>
              <div>
                <CCard className="mb-6">
                  <CCardTitle>Customer Details</CCardTitle>
                  <CCardBody className="p-4">
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <span className="w-24 text-sm font-medium text-gray-500">ID:</span>
                          <span className="text-gray-900">3253</span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-24 text-sm font-medium text-gray-500">Name:</span>
                          <span className="text-gray-900">3253</span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-24 text-sm font-medium text-gray-500">Country:</span>
                          <span className="text-gray-900">3253</span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-24 text-sm font-medium text-gray-500">Clicks:</span>
                          <span className="text-gray-900">3253</span>
                        </div>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  )
}

export default UserAnalytics
