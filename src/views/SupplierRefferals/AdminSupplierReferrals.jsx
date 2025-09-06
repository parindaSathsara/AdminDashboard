import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CFormInput,
  CInputGroup,
  CPagination,
  CPaginationItem,
  CSpinner
} from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminSupplierReferrals = () => {
  const [overallStats, setOverallStats] = useState({
    total_referrals: 0,
    accepted_referrals: 0,
    pending_referrals: 0,
    rejected_referrals: 0
  });
  const [suppliers, setSuppliers] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchSupplierReferrals();
  }, [currentPage]);

  const fetchSupplierReferrals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/supplier_referral', {
        params: { 
          page: currentPage, 
          per_page: perPage, 
          search: searchTerm 
        }
      });
      
      if (response.data.status === 200) {
        setOverallStats(response.data.data.overall_stats);
        setSuppliers(response.data.data.suppliers);
      }
    } catch (error) {
      console.error('Error fetching supplier referrals:', error);
      Swal.fire('Error', 'Failed to load supplier referral data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSupplierReferrals();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (count, type) => {
    const colorMap = {
      total: 'primary',
      accepted: 'success',
      pending: 'warning',
      rejected: 'danger'
    };
    
    return <CBadge color={colorMap[type]}>{count || 0}</CBadge>;
  };

  return (
    <div className="admin-supplier-referrals">
      <CRow>
        <CCol xs={12}>
          <h2 className="mb-4">Supplier Referrals Overview</h2>
        </CCol>
      </CRow>

      {/* Overall Statistics */}
      <CRow className="mb-4">
        <CCol md={3} className="mb-3">
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-primary">{overallStats.total_referrals || 0}</h3>
              <p className="text-muted mb-0">Total Referrals</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3} className="mb-3">
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-success">{overallStats.accepted_referrals || 0}</h3>
              <p className="text-muted mb-0">Accepted</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3} className="mb-3">
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-warning">{overallStats.pending_referrals || 0}</h3>
              <p className="text-muted mb-0">Pending</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3} className="mb-3">
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-danger">{overallStats.rejected_referrals || 0}</h3>
              <p className="text-muted mb-0">Rejected</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Search */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CInputGroup>
            <CFormInput
              placeholder="Search by supplier name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <CButton color="primary" onClick={handleSearch}>
              Search
            </CButton>
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Suppliers Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Referrals by Supplier</h5>
              <small className="text-muted">
                Showing {suppliers.from || 0} to {suppliers.to || 0} of {suppliers.total || 0} suppliers
              </small>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center py-4">
                  <CSpinner />
                </div>
              ) : (
                <>
                  <CTable striped hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Supplier</CTableHeaderCell>
                        <CTableHeaderCell>Company</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Total</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Accepted</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Pending</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Rejected</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {suppliers.data && suppliers.data.length > 0 ? (
                        suppliers.data.map((supplier) => (
                          <CTableRow key={supplier.id}>
                            <CTableDataCell>
                              {supplier.first_name} {supplier.last_name}
                            </CTableDataCell>
                            <CTableDataCell>
                              {supplier.company_name || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                              {supplier.email}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {getStatusBadge(supplier.total_referrals, 'total')}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {getStatusBadge(supplier.accepted_referrals, 'accepted')}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {getStatusBadge(supplier.pending_referrals, 'pending')}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {getStatusBadge(supplier.rejected_referrals, 'rejected')}
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={7} className="text-center py-4">
                            {searchTerm ? 'No suppliers found matching your search' : 'No suppliers with referrals found'}
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                  
                  {/* Pagination */}
                  {suppliers.total > perPage && (
                    <CPagination className="mt-3 justify-content-center">
                      <CPaginationItem 
                        disabled={suppliers.current_page === 1}
                        onClick={() => handlePageChange(suppliers.current_page - 1)}
                      >
                        Previous
                      </CPaginationItem>
                      
                      {[...Array(suppliers.last_page)].map((_, i) => (
                        <CPaginationItem
                          key={i + 1}
                          active={i + 1 === suppliers.current_page}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      
                      <CPaginationItem 
                        disabled={suppliers.current_page === suppliers.last_page}
                        onClick={() => handlePageChange(suppliers.current_page + 1)}
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default AdminSupplierReferrals;