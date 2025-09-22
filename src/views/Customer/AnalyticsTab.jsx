import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CFormSelect,
  CButton
} from '@coreui/react';
import { CChartLine, CChartBar, CChartDoughnut } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilChart, cilCalendar, cilDevices, cilSpeedometer  } from '@coreui/icons';

const AnalyticsTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7'); // 7, 30, 90 days
  const [analyticsData, setAnalyticsData] = useState({
    sessionsOverTime: [],
    routeAnalytics: [],
    deviceDistribution: [],
    dashboardData: null
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));
      const startDateStr = startDate.toISOString().split('T')[0];

      // Fetch all analytics data
      const [sessionsRes, routesRes, devicesRes, dashboardRes] = await Promise.all([
        axios.get(`customer/analytics/global/sessions-over-time`, {
          params: { start_date: startDateStr, end_date: endDate, group_by: 'day' }
        }),
        axios.get(`customer/analytics/global/route-analytics`, {
          params: { start_date: startDateStr, end_date: endDate, limit: 10 }
        }),
        axios.get(`customer/analytics/global/device-distribution`, {
          params: { start_date: startDateStr, end_date: endDate }
        }),
        axios.get(`customer/analytics/global/dashboard`, {
          params: { start_date: startDateStr, end_date: endDate }
        })
      ]);

      setAnalyticsData({
        sessionsOverTime: sessionsRes.data.data,
        routeAnalytics: routesRes.data.data,
        deviceDistribution: devicesRes.data.data,
        dashboardData: dashboardRes.data.data
      });
    } catch (err) {
      setError('Error fetching analytics data: ' + err.message);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <div className="mt-2">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="m-3">
        {error}
        <CButton color="primary" size="sm" className="ms-3" onClick={fetchAnalyticsData}>
          Retry
        </CButton>
      </CAlert>
    );
  }

  return (
    <div>
      {/* Time Range Selector */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Global Analytics Dashboard</h5>
                <small className="text-muted">Overview of platform usage and engagement</small>
              </div>
              <div className="d-flex align-items-center">
                <span className="me-2">Time Range:</span>
                <CFormSelect
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </CFormSelect>
                <CButton color="primary" className="ms-2" onClick={fetchAnalyticsData}>
                  Refresh
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Summary Stats */}
      {analyticsData.dashboardData && (
        <CRow className="mb-4">
          <CCol md={3}>
            <CCard className="text-center">
              <CCardBody>
                <div className="text-medium-emphasis small">Total Sessions</div>
                <div className="fs-4 fw-semibold">
                  {analyticsData.dashboardData.basic_stats?.total_sessions || 0}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center">
              <CCardBody>
                <div className="text-medium-emphasis small">Unique Users</div>
                <div className="fs-4 fw-semibold">
                  {analyticsData.dashboardData.basic_stats?.unique_users || 0}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center">
              <CCardBody>
                <div className="text-medium-emphasis small">Avg. Session Duration</div>
                <div className="fs-4 fw-semibold">
                  {formatDuration(analyticsData.dashboardData.basic_stats?.avg_session_duration || 0)}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center">
              <CCardBody>
                <div className="text-medium-emphasis small">Screens per Session</div>
                <div className="fs-4 fw-semibold">
                  {Math.round(analyticsData.dashboardData.basic_stats?.avg_screens_per_session || 0)}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Charts */}
      <CRow className="g-4">
        {/* Sessions Over Time */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <div className="d-flex align-items-center">
                <CIcon icon={cilCalendar} className="me-2" />
                <h5 className="mb-0">Sessions Over Time</h5>
              </div>
            </CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: analyticsData.sessionsOverTime.map(item => 
                    new Date(item.date).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: 'Sessions',
                      backgroundColor: 'rgba(151, 187, 205, 0.2)',
                      borderColor: 'rgba(151, 187, 205, 1)',
                      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                      data: analyticsData.sessionsOverTime.map(item => item.session_count)
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Device Distribution */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <div className="d-flex align-items-center">
                <CIcon icon={cilDevices} className="me-2" />
                <h5 className="mb-0">Device Distribution</h5>
              </div>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: analyticsData.deviceDistribution.slice(0, 5).map(item => 
                    `${item.device_name} (${item.os})`
                  ),
                  datasets: [
                    {
                      backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                      ],
                      data: analyticsData.deviceDistribution.slice(0, 5).map(item => 
                        item.sessions_count
                      )
                    }
                  ]
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Top Routes */}
        <CCol lg={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex align-items-center">
                <CIcon icon={cilSpeedometer } className="me-2" />
                <h5 className="mb-0">Top Routes</h5>
              </div>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: analyticsData.routeAnalytics.map(item => item.route_name),
                  datasets: [
                    {
                      label: 'Visits',
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                      data: analyticsData.routeAnalytics.map(item => item.total_visits)
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Data Tables */}
      <CRow className="g-4 mt-2">
        {/* Top Routes Table */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Top Routes Details</h5>
            </CCardHeader>
            <CCardBody>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Visits</th>
                      <th>Avg. Duration</th>
                      <th>Unique Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.routeAnalytics.map((route, index) => (
                      <tr key={index}>
                        <td>{route.route_name}</td>
                        <td>{route.total_visits}</td>
                        <td>{formatDuration(route.average_duration)}</td>
                        <td>{route.unique_users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Device Distribution Table */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Device Distribution Details</h5>
            </CCardHeader>
            <CCardBody>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>OS</th>
                      <th>Sessions</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.deviceDistribution.map((device, index) => (
                      <tr key={index}>
                        <td>{device.device_name}</td>
                        <td>{device.os} {device.os_version}</td>
                        <td>{device.sessions_count}</td>
                        <td>{device.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default AnalyticsTab;