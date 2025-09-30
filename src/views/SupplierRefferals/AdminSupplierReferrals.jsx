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
  CFormSelect,
  CInputGroup,
  CPagination,
  CPaginationItem,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle
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
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(''); // '' = all

  

  useEffect(() => {
    fetchSupplierReferrals();
  }, [currentPage, perPage, searchTerm,selectedStatus]);

  const fetchSupplierReferrals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/supplier_refferal', {
        params: {
          page: currentPage,
          per_page: perPage,
          search: searchTerm,
           status: selectedStatus,
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


  const fetchSupplierReferralDetails = async (supplierId) => {
    try {
      setReferralsLoading(true);
      const response = await axios.get(`/supplier-referrals/${supplierId}`);

      if (response.data.status === 200) {
        setReferrals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching referral details:', error);
      Swal.fire('Error', 'Failed to load referral details', 'error');
    } finally {
      setReferralsLoading(false);
    }
  };

  const viewSupplierReferrals = async (supplier) => {
    setSelectedSupplier(supplier);
    await fetchSupplierReferralDetails(supplier.id);
    setShowReferralsModal(true);
  };

  const handleApprove = async (referralId) => {
    try {
      setProcessing(true);
      const response = await axios.post(`/supplier-referrals/${referralId}/approve`);

      if (response.data.status === 200) {
        Swal.fire('Success', 'Referral approved successfully', 'success');
        // Refresh both the main list and the modal data
        fetchSupplierReferrals();
        if (selectedSupplier) {
          fetchSupplierReferralDetails(selectedSupplier.id);
        }
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error approving referral:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to approve referral', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (referralId) => {
    try {
      setProcessing(true);
      const response = await axios.post(`/supplier-referrals/${referralId}/reject`);

      if (response.data.status === 200) {
        Swal.fire('Success', 'Referral rejected successfully', 'success');
        // Refresh both the main list and the modal data
        fetchSupplierReferrals();
        if (selectedSupplier) {
          fetchSupplierReferralDetails(selectedSupplier.id);
        }
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error rejecting referral:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to reject referral', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // fetchSupplierReferrals();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= suppliers.last_page) {
      setCurrentPage(page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
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

  const getReferralStatusBadge = (status) => {
    const colorMap = {
      accepted: 'success',
      pending: 'warning',
      rejected: 'danger'
    };

    return <CBadge color={colorMap[status]}>{status}</CBadge>;
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, suppliers.current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(suppliers.last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <CPaginationItem
        key="prev"
        disabled={suppliers.current_page === 1}
        onClick={() => handlePageChange(suppliers.current_page - 1)}
      >
        Previous
      </CPaginationItem>
    );

    if (startPage > 1) {
      items.push(
        <CPaginationItem
          key={1}
          active={1 === suppliers.current_page}
          onClick={() => handlePageChange(1)}
        >
          1
        </CPaginationItem>
      );

      if (startPage > 2) {
        items.push(<CPaginationItem key="ellipsis1" disabled>...</CPaginationItem>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <CPaginationItem
          key={i}
          active={i === suppliers.current_page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    if (endPage < suppliers.last_page) {
      if (endPage < suppliers.last_page - 1) {
        items.push(<CPaginationItem key="ellipsis2" disabled>...</CPaginationItem>);
      }

      items.push(
        <CPaginationItem
          key={suppliers.last_page}
          active={suppliers.last_page === suppliers.current_page}
          onClick={() => handlePageChange(suppliers.last_page)}
        >
          {suppliers.last_page}
        </CPaginationItem>
      );
    }

    items.push(
      <CPaginationItem
        key="next"
        disabled={suppliers.current_page === suppliers.last_page}
        onClick={() => handlePageChange(suppliers.current_page + 1)}
      >
        Next
      </CPaginationItem>
    );

    return items;
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

      {/* Search and Rows Per Page */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CInputGroup>
            <CFormInput
              placeholder="Search by supplier name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* Show X mark only if there's a searchTerm */}
            {searchTerm && (
              <CButton
                color="dark"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1); // reset to first page
                }}
              >
                ✕
              </CButton>
            )}

            <CButton color="primary" onClick={handleSearch}>
              Search
            </CButton>
          </CInputGroup>
        </CCol>
        <CCol md={3}>
  <CFormSelect
    value={selectedStatus}
    onChange={(e) => {
      setSelectedStatus(e.target.value);
      setCurrentPage(1); // reset to first page
    }}
  >
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="accepted">Accepted</option>
    <option value="rejected">Rejected</option>
  </CFormSelect>
</CCol>

      </CRow>


      {/* Suppliers Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
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
                        <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
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
                            <CTableDataCell className="text-center">
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => viewSupplierReferrals(supplier)}
                                disabled={supplier.total_referrals === 0}
                              >
                                View Referrals
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={8} className="text-center py-4">
                            {searchTerm ? 'No suppliers found matching your search' : 'No suppliers with referrals found'}
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>

                  {/* Pagination */}
                  {suppliers.last_page > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-nowrap">
                      <div>
                        Showing {suppliers.from || 0} to {suppliers.to || 0} of {suppliers.total || 0} entries
                      </div>

                      <div className="d-flex align-items-center ms-3">
                        <span className="me-2">Rows per page:</span>
                        <CFormSelect
                          value={perPage}
                          onChange={handlePerPageChange}
                          style={{ width: '80px' }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </CFormSelect>
                      </div>

                      <div className="ms-3">
                        <CPagination className="mb-0 flex-nowrap">
                          {renderPaginationItems()}
                        </CPagination>
                      </div>
                    </div>

                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Referrals Modal */}
      {/* Referrals Modal */}
      <CModal visible={showReferralsModal} onClose={() => setShowReferralsModal(false)} size="xl">
        <CModalHeader>
          <CModalTitle>
            Referrals for {selectedSupplier?.first_name} {selectedSupplier?.last_name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {referralsLoading ? (
            <div className="text-center py-4">
              <CSpinner />
            </div>
          ) : (
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Referral ID</CTableHeaderCell>
                  <CTableHeaderCell>Referred Vendor</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Company</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {referrals.length > 0 ? (
                  referrals.map((referral) => (
                    <CTableRow key={referral.id}>
                      <CTableDataCell>#{referral.id}</CTableDataCell>
                      <CTableDataCell>
                        {referral.referred_vendor_first_name || referral.referred_vendor_last_name
                          ? `${referral.referred_vendor_first_name || ''} ${referral.referred_vendor_last_name || ''}`.trim()
                          : 'N/A'
                        }
                      </CTableDataCell>
                      <CTableDataCell>
                        {referral.referred_vendor_email || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {referral.referred_vendor_company || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getReferralStatusBadge(referral.status)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(referral.created_at).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {referral.status === 'pending' && (
                          <>
                            <CButton
                              color="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleApprove(referral.id)}
                              disabled={processing}
                            >
                              Approve
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleReject(referral.id)}
                              disabled={processing}
                            >
                              Reject
                            </CButton>
                          </>
                        )}
                        {referral.status !== 'pending' && (
                          <span className="text-muted">Processed</span>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-4">
                      No referrals found for this supplier
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowReferralsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdminSupplierReferrals;