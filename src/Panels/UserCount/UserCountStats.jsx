import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { toast, ToastContainer } from 'react-toastify';
import { CIcon } from '@coreui/icons-react';
import { cilUser, cilChart, cilArrowCircleTop, cilClock } from '@coreui/icons';
import 'react-toastify/dist/ReactToastify.css';
import BeepSound from '../../assets/beep-sound.mp3';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const UserCountStats = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    yesterday_users: 0,
    today_users: 0,
    user_increase: 0,
    today_growth_percentage: 0,
    last_week_growth: [],
    last_month_growth: []
  });

  const [newUsers, setNewUsers] = useState([]);
  const [newLastUsers, setNewLastUsers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const beepSoundRef = useRef(null);
  const lastNotificationTime = useRef(0);
  const processedUserIds = useRef(new Set());
  const notificationCount = useRef(0);

  useEffect(() => {
    beepSoundRef.current = new Audio(BeepSound);
    beepSoundRef.current.volume = 0.7;

    beepSoundRef.current.onerror = (e) => {
      console.error('Audio error:', e);
      toast.error('Sound playback failed. Check audio file.');
    };
  }, []);



  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/users/count-stats');
      setStats(prev => ({
        ...prev,
        ...response.data
      }));
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Optional: Add toast notification for connection issues
      toast.error('Failed to fetch user statistics. Retrying...');
    }
  };
  const fetchLastUsers = async () => {
    try {
      const response = await axios.get('/users/check-last-users');
      setNewLastUsers(prev => ({
        ...prev,
        ...response.data
      }));
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Optional: Add toast notification for connection issues
      toast.error('Failed to fetch user statistics. Retrying...');
    }
  };

  const checkNewUsers = async () => {
    try {
      const response = await axios.get('/users/check-new-users');
      const currentTime = Date.now();

      const trulyNewUsers = response.data.new_users.filter(user =>
        !processedUserIds.current.has(user.id)
      );

      if (trulyNewUsers.length > 0) {
        if (currentTime - lastNotificationTime.current > 10000) {
          notificationCount.current = 0;
        }

        if (notificationCount.current < 2) {
          trulyNewUsers.forEach(user => processedUserIds.current.add(user.id));
          setNewUsers(trulyNewUsers);


          if (beepSoundRef.current) {
            beepSoundRef.current.currentTime = 0;
            beepSoundRef.current.play().catch(e => {
              console.error('Audio play failed:', e);
            });
          }

          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);

          toast.success(`🎉 ${trulyNewUsers.length} New User${trulyNewUsers.length > 1 ? 's' : ''} Registered!`, {
            position: "top-right",
            autoClose: 5000,
          });

          notificationCount.current += 1;
          lastNotificationTime.current = currentTime;
        }
      }
    } catch (error) {
      console.error('Error checking new users:', error);
    }
  };

  // Chart configuration for last week and last month growth
  const growthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0'
        }
      },
      title: {
        display: true,
        text: 'User Growth Trend',
        color: '#63b3ed'
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#a0aec0'
        },
        grid: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      y: {
        ticks: {
          color: '#a0aec0'
        },
        grid: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    }
  };

  const growthChartData = {
    labels: stats.last_week_growth.map(item => item.date) || [],
    datasets: [
      {
        label: 'Last Week Growth',
        data: stats.last_week_growth.map(item => item.users) || [],
        borderColor: '#48bb78',
        backgroundColor: 'rgba(72, 187, 120, 0.2)',
        tension: 0.3
      },
      {
        label: 'Last Month Growth',
        data: stats.last_month_growth.map(item => item.users) || [],
        borderColor: '#4299e1',
        backgroundColor: 'rgba(66, 153, 225, 0.2)',
        tension: 0.3
      }
    ]
  };

  useEffect(() => {
    fetchUserStats();
    checkNewUsers();
    fetchLastUsers()



    const statsIntervalId = setInterval(fetchUserStats, 10000);
    const newUsersIntervalId = setInterval(checkNewUsers, 5000);

    return () => {
      clearInterval(statsIntervalId);
      clearInterval(newUsersIntervalId);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      padding: '24px',
      background: 'linear-gradient(to bottom right, #1a202c, #2d3748)',
      // borderRadius: '16px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      gap: '24px',
      color: '#e2e8f0'
    }}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
      <ToastContainer />

      {/* Left Side: New Users */}
      <div style={{
        flex: '0.8',
        background: 'rgba(45, 55, 72, 0.7)',
        borderRadius: '16px',
        padding: '24px',
        overflowY: 'auto',
        maxHeight: '100%'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#63b3ed',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <CIcon icon={cilArrowCircleTop} style={{ marginRight: '12px' }} size="xl" />
          New Users
        </h3>
        {newUsers.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {newUsers.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'rgba(76, 81, 96, 0.5)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#63b3ed',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  {/* <p style={{ fontWeight: '600', color: '#e2e8f0' }}>{user.username}</p> */}
                  <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>{user.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#718096',
            padding: '24px'
          }}>
            No new users at the moment
          </div>
        )}
      </div>

      {/* Middle: Total Users Round */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '400px'  // Increased width
      }}>
        <div style={{
          width: '350px',  // Increased width
          height: '350px', // Increased height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // border: '6px solid #63b3ed',
          borderRadius: '50px',
          // background: 'linear-gradient(145deg, #2c3748, #1a202c)',
          // boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
          marginBottom: '24px'
        }}>
          <CIcon icon={cilUser} style={{ color: '#63b3ed', marginBottom: '10px' }} size="3xl" />
          <p style={{
            fontSize: '8rem',
            fontWeight: '900',
            color: '#63b3ed',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            lineHeight: 0.8
          }}>{stats.total_users}</p>
          <p style={{
            fontSize: '2rem',
            color: '#a0aec0',
            marginTop: '8px'
          }}>Total Users</p>
        </div>

        {/* Stats below Total Users */}
        <div style={{
          display: 'grid',
          gap: '16px',
          width: '100%'
        }}>
          <div style={{
            background: 'rgba(45, 55, 72, 0.7)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#4299e1', marginBottom: '8px' }}>Yesterday</h3>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#4299e1'
            }}>{stats.yesterday_users}</p>
          </div>
          <div style={{
            background: 'rgba(45, 55, 72, 0.7)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#48bb78', marginBottom: '8px' }}>Today</h3>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#48bb78'
            }}>{stats.today_users}
              <span style={{
                fontSize: '0.875rem',
                marginLeft: '8px',
                color: stats.today_growth_percentage > 0 ? '#48bb78' : '#f56565'
              }}>
                ({stats.today_growth_percentage > 0 ? '+' : ''}{stats.today_growth_percentage}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Full User Count */}
      <div style={{
        flex: '0.8',
        background: 'rgba(45, 55, 72, 0.7)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#63b3ed',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <CIcon icon={cilChart} style={{ marginRight: '12px' }} size="xl" />
          User Growth Trends
        </h3>
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Week Growth */}
          <div style={{
            flex: 1,
            background: 'rgba(76, 81, 96, 0.5)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h4 style={{
              color: '#4299e1',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              Week Growth
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stats.last_week_growth_percentage >= 0 ? '#48bb78' : '#f56565'
            }}>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginRight: '8px'
              }}>
                {Math.abs(stats.last_week_growth_percentage || 0).toFixed(1)}%
              </p>
              {stats.last_week_growth_percentage > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="23 6 16 6 16 13"></polyline>
                </svg>
              ) : stats.last_week_growth_percentage < 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                  <polyline points="23 18 16 18 16 11"></polyline>
                </svg>
              ) : null}
            </div>
          </div>

          {/* Month Growth */}
          <div style={{
            flex: 1,
            background: 'rgba(76, 81, 96, 0.5)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h4 style={{
              color: '#48bb78',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              Month Growth
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stats.last_month_growth_percentage >= 0 ? '#48bb78' : '#f56565'
            }}>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginRight: '8px'
              }}>
                {Math.abs(stats.last_month_growth_percentage || 0).toFixed(1)}%
              </p>
              {stats.last_month_growth_percentage > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="23 6 16 6 16 13"></polyline>
                </svg>
              ) : stats.last_month_growth_percentage < 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                  <polyline points="23 18 16 18 16 11"></polyline>
                </svg>
              ) : null}
            </div>
          </div>
        </div>

        {/* Existing Chart */}
        <div style={{
          background: 'rgba(76, 81, 96, 0.5)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
          <Line
            data={growthChartData}
            options={growthChartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCountStats;