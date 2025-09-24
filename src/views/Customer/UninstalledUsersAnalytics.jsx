import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner,
  CBadge,
  CContainer,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { format, subDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfDay, startOfWeek, endOfWeek } from 'date-fns';

const UninstalledUsersAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState({
    users: {
      data: [],
      total: 0,
      current_page: 1,
      last_page: 1
    },
    analytics: [],
    user_stats: {
      active_users: 0,
      uninstalled_users: 0,
      logout_users: 0,
      total_users: 0
    },
    total_count: 0,
    filters: {}
  });
  const [filters, setFilters] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    groupBy: 'day'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const currentItems = data.users.data || [];
  const totalPages = data.users.last_page || 1;

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null,
        end_date: filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null,
        group_by: filters.groupBy,
        page: currentPage
      };

      const response = await axios.get('/customer/analytics/uninstalled-users', { params });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      groupBy: 'day'
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const exportToExcel = async () => {
    try {
      setExporting(true);
      const params = {
        start_date: filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null,
        end_date: filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null,
        group_by: filters.groupBy,
        export: true
      };

      const response = await axios.get('/customer/analytics/uninstalled-users', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user_analytics_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting file:', error);
    } finally {
      setExporting(false);
    }
  };

  const createCompleteDateRange = () => {
    if (!filters.startDate || !filters.endDate) return [];
    const start = startOfDay(filters.startDate);
    const end = startOfDay(filters.endDate);

    if (filters.groupBy === 'day') {
      return eachDayOfInterval({ start, end }).map(date => ({
        date: format(date, 'yyyy-MM-dd'),
        display: format(date, 'MMM dd'),
        count: 0
      }));
    } else if (filters.groupBy === 'week') {
      const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
      return weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        // Get ISO week number
        const weekNumber = format(weekStart, 'w');
        const year = weekStart.getFullYear();

        return {
          date: format(weekStart, 'yyyy-MM-dd'),
          display: `Week ${weekNumber}, ${year}`,
          count: 0
        };
      });
    } else {
      // Monthly
      const months = eachMonthOfInterval({ start, end });
      return months.map(date => ({
        date: format(date, 'yyyy-MM-01'),
        display: format(date, 'MMM yyyy'),
        count: 0
      }));
    }
  };

  const getChartData = () => {
    // If no analytics data, show empty chart with complete date range
    if (!data.analytics || !Array.isArray(data.analytics)) {
      const completeRange = createCompleteDateRange();
      return {
        labels: completeRange.map(item => item.display),
        datasets: [{
          label: 'Uninstalls',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          data: completeRange.map(item => item.count)
        }]
      };
    }

    try {
      // Create complete date range for the selected period
      const completeRange = createCompleteDateRange();

      // Map analytics data to the complete range
      const mergedData = completeRange.map(rangeItem => {
        let foundItem = null;

        if (filters.groupBy === 'week') {
          // For weekly data, find matching week
          const rangeWeek = parseInt(rangeItem.display.match(/Week (\d+)/)?.[1]);
          const rangeYear = parseInt(rangeItem.display.match(/, (\d+)/)?.[1]);
          foundItem = data.analytics.find(item =>
            item.year === rangeYear && item.week === rangeWeek
          );
        } else if (filters.groupBy === 'month') {
          // For monthly data, find matching month
          const rangeYear = parseInt(rangeItem.display.match(/(\d+)$/)?.[1]);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const rangeMonth = monthNames.indexOf(rangeItem.display.split(' ')[0]) + 1;
          foundItem = data.analytics.find(item =>
            item.year === rangeYear && item.month === rangeMonth
          );
        } else {
          // For daily data, find matching date
          foundItem = data.analytics.find(item => item.date === rangeItem.date);
        }

        return {
          ...rangeItem,
          count: foundItem ? foundItem.count : 0
        };
      });

      return {
        labels: mergedData.map(item => item.display),
        datasets: [{
          label: `Uninstalls per ${filters.groupBy.charAt(0).toUpperCase() + filters.groupBy.slice(1)}`,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          data: mergedData.map(item => item.count)
        }]
      };
    } catch (error) {
      console.error('Error preparing chart data:', error);
      return {
        labels: ['Error Loading Data'],
        datasets: [{
          label: 'Uninstalls',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          data: [0]
        }]
      };
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">User Analytics Dashboard</h2>
              <p className="text-muted mb-0">
                {format(filters.startDate, 'MMM dd, yyyy')} to {format(filters.endDate, 'MMM dd, yyyy')}
              </p>
            </div>

          </div>
        </CCol>
      </CRow>

      {/* IMPROVED User Status Summary Cards */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
            <CCardBody className="text-center p-3 text-white">
              <div className="h2 fw-bold mb-1">{data.user_stats?.active_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Active Users</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #e4606d 100%)' }}>
            <CCardBody className="text-center p-3 text-white">
              <div className="h2 fw-bold mb-1">{data.user_stats?.uninstalled_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Uninstalled Users</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #fd7e14 0%, #fd9843 100%)' }}>
            <CCardBody className="text-center p-3 text-white">
              <div className="h2 fw-bold mb-1">{data.user_stats?.logout_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Logged Out Users</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #6fdaeb 100%)' }}>
            <CCardBody className="text-center p-3 text-white">
              <div className="h2 fw-bold mb-1">{data.user_stats?.total_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Total Users</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Alternative Simple Cards (if gradients don't work) */}
      <CRow className="mb-4 d-none">
        <CCol md={3}>
          <CCard className="border-0 shadow-sm bg-success text-white">
            <CCardBody className="text-center p-3">
              <div className="h2 fw-bold mb-1">{data.user_stats?.active_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Active Users</div>
              <small className="opacity-75">status=login & uninstall_detected_at=null</small>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm bg-danger text-white">
            <CCardBody className="text-center p-3">
              <div className="h2 fw-bold mb-1">{data.user_stats?.uninstalled_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Uninstalled Users</div>
              <small className="opacity-75">uninstall_detected_at != null</small>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm bg-warning text-white">
            <CCardBody className="text-center p-3">
              <div className="h2 fw-bold mb-1">{data.user_stats?.logout_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Logged Out Users</div>
              <small className="opacity-75">status=logout</small>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm bg-info text-white">
            <CCardBody className="text-center p-3">
              <div className="h2 fw-bold mb-1">{data.user_stats?.total_users?.toLocaleString() || '0'}</div>
              <div className="h6 mb-1">Total Users</div>
              <small className="opacity-75">All registered users</small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Rest of your components remain the same */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">Filters & Controls</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}>
              <label className="form-label">Start Date</label>
              <DatePicker
                selected={filters.startDate}
                onChange={date => handleFilterChange('startDate', date)}
                className="form-control"
                dateFormat="MMM dd, yyyy"
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">End Date</label>
              <DatePicker
                selected={filters.endDate}
                onChange={date => handleFilterChange('endDate', date)}
                className="form-control"
                dateFormat="MMM dd, yyyy"
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Group By</label>
              <CFormSelect
                value={filters.groupBy}
                onChange={e => handleFilterChange('groupBy', e.target.value)}
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </CFormSelect>
            </CCol>
            <CCol md={3} className="d-flex align-items-end gap-2">
              <CButton color="primary" onClick={() => { setCurrentPage(1); fetchData(); }} className="flex-fill">
                Apply Filters
              </CButton>
              <CButton color="secondary" onClick={handleResetFilters}>
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-1">Uninstalls Over Time</h5>
        </CCardHeader>
        <CCardBody>
          <CChartBar
            data={getChartData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
            height={400}
          />
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Uninstalled Users Details</h5>
              <small className="text-muted">Total: {data.total_count} users</small>
            </div>
            <CButton color="outline-success" size="sm" onClick={exportToExcel} disabled={exporting}>
              {exporting ? <CSpinner size="sm" /> : 'Export Excel'}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-4">
              <CSpinner />
              <div className="mt-2">Loading user analytics data...</div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Username</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Platform</CTableHeaderCell>
                      <CTableHeaderCell>User Since</CTableHeaderCell>
                      <CTableHeaderCell>Uninstalled At</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell><strong>{item.username || 'N/A'}</strong></CTableDataCell>
                          <CTableDataCell>{item.email || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={item.user_platform === 'iOS' ? 'primary' : 'success'}>
                              {item.user_platform || 'Unknown'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell><small>{formatDate(item.user_created_at)}</small></CTableDataCell>
                          <CTableDataCell><strong>{formatDate(item.uninstalled_detected_at)}</strong></CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={item.uninstalled_detected_at ? 'danger' : 'success'}>
                              {item.uninstalled_detected_at ? 'Uninstalled' : 'Active'}
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center py-4">
                          <div className="text-muted">No users found for the selected period</div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    Page {currentPage} of {totalPages} • {data.users.total} records
                  </small>
                  <CPagination>
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                      First
                    </CPaginationItem>
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <CPaginationItem key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </CPaginationItem>
                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                      Last
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default UninstalledUsersAnalytics;