import React, { useContext, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CCardTitle,
  CCardText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilExitToApp, cilList, cilMenu } from '@coreui/icons'
import axios from 'axios'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import logo from '../assets/brand/aahaas.png'
import { UserLoginContext } from 'src/Context/UserLoginContext'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const navigate = useNavigate();

  const { userLogin, setUserLogin, userData, setUserData } = useContext(UserLoginContext);

  const [status, setStatus] = useState('not_available');

  useEffect(() => {
    // Fetch the initial status from the API when the component mounts
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/admin/status'); // Adjust the endpoint as needed
        setStatus(response.data.status);
      } catch (error) {
        console.error('Failed to fetch status', error);
      }
    };

    fetchStatus();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); 
    localStorage.clear(); 

    setUserLogin(false)
    navigate('/login');
  };

  const handleToggleChange = async () => {
    const newStatus = status === 'available' ? 'not_available' : 'available';
    try {
      const response = await axios.post('/admin/toggle-status', {
        status: newStatus,
      });
      setStatus(response.data.data.status);
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <img src={logo} height={30} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <input
              type="checkbox"
              checked={status === 'available'}
              onChange={handleToggleChange}
              style={{ transform: 'scale(1.5)', marginRight: '10px' }}
            />
            <label>{status === 'available' ? 'Available' : 'Not Available'}</label>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown handleLogout={handleLogout} userData={userData} />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
