import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CFormSwitch,
  CRow,
  CCol,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CCloseButton,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilMenu, cilHeadphones } from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
import logo from '../assets/brand/aahaas.png';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { adminToggleStatus } from 'src/service/api_calls';
import CurrencyController from './CurrencyController';
import HotList from 'src/views/HotList/HotList';
import { fetchInAppNotifications, fetchInAppNotificationsCount, readInAppNotifications, readInAppNotificationsOrderWise } from 'src/views/HotList/service/HotListServices';

import Swal from 'sweetalert2'
import './AppHeader.css';
import SupportSidebar from 'src/views/Support/SupportSidebar';
import axios from 'axios';

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navigate = useNavigate();
  const { userLogin, setUserLogin, userData, setUserData } = useContext(UserLoginContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await axios
      .get('/user_logout')
      .then((res) => {
        sessionStorage.clear();
        localStorage.clear();
        setUserLogin(false);
        navigate('/login');
      })
      .catch((err) => {
        throw new Error(err)
      })
  };

  const [switchState, setSwitchState] = useState(false);

  const handleToggleOnChange = (e) => {
    const newSwitchState = e.target.checked;
    setSwitchState(newSwitchState);
    localStorage.setItem('userActive', newSwitchState);

    const status = newSwitchState ? "Active" : "Inactive";
    adminToggleStatus(status, userData.id);
  };

  const location = useLocation();
  
  useEffect(() => {
    const userActive = JSON.parse(localStorage.getItem('userActive'));
    setSwitchState(userActive);
    
    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [unReadCount, setUnReadCount] = useState(0)
  const [newHotList, setNewHotList] = useState([])

  useEffect(() => {
    const fetchNotifications = () => {
      readInAppNotificationsOrderWise().then(response => {
        setUnReadCount(response?.data?.data?.unread_count);
        setNewHotList(response?.data?.data?.notifications);
      });
    };

    fetchNotifications();
  }, [userData?.id]);

  const [hotListSide, setHotListSide] = useState(false)
  const [hotList, setHotList] = useState([])
  const [supportRequestCount, setSupportRequestCount] = useState(0);
  const [supportReqests, setSupportReqests] = useState([]);
  const [supportSidebarVisible, setSupportSidebarVisible] = useState(false);

  const getHotList = () => {
    fetchInAppNotifications(userData?.id).then(res => {
      setHotList(res)
    })
  }

  const getHelpCount = () => {
    axios.get("/helpcount").then((res) => {
      setSupportRequestCount(res.data.data);
    })
      .catch((err) => {
        throw new Error(err)
      })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getHelpCount();
      fetchSupportReq();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchSupportReq = () => {
    axios.get("/help").then((res) => {
      setSupportReqests(res.data);
    })
  }

  const handleSupportReqClick = () => {
    setSupportSidebarVisible(true);
  }

  const handleNotificationOnClick = () => {
    setHotListSide(!hotListSide)
    getHotList()
    readInAppNotifications(userData?.id)

    fetchInAppNotificationsCount(userData?.id).then(response => {
      setUnReadCount(response);
    });
  }

  const handleIncreaseNotification = () => {
    // Notification increase handler
  }

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <COffcanvas backdrop={true} placement="end" visible={hotListSide} dark >
        <COffcanvasHeader>
          <COffcanvasTitle>Hotlist</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => handleNotificationOnClick()} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <HotList increaseNotification={handleIncreaseNotification} display={hotListSide} data={newHotList}></HotList>
        </COffcanvasBody>
      </COffcanvas>

      <CHeader position="sticky" className="mb-4 app-header">
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

          {/* Mobile menu button - only shows on mobile */}
          {isMobile && (
            <CHeaderToggler
              className="mobile-menu-toggler ms-auto"
              onClick={toggleMobileMenu}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
          )}

          <CHeaderNav className="d-none d-md-flex me-auto" />

          {/* Desktop header content */}
          {!isMobile && (
            <CHeaderNav>
              <CRow className="align-items-center">
                <CCol className="d-flex align-items-center justify-content-center currency-col">
                  {location.pathname === '/orders' && <CurrencyController />}
                </CCol>
                
                <CCol className="d-flex align-items-center justify-content-center header-notification-bell" onClick={() => handleSupportReqClick()}>
                  {supportRequestCount === 0 ?
                    null
                    :
                    <CBadge color="danger" shape="rounded-pill" className="notification-badge">
                      {supportRequestCount}
                    </CBadge>
                  }
                  <CIcon style={{ color: 'black', marginTop: '5px' }} icon={cilHeadphones} size="lg" />
                </CCol>

                <CCol className="d-flex align-items-center justify-content-center">
                  <CFormSwitch
                    size="xl"
                    label={switchState ? 'Active' : 'Inactive'}
                    id="formSwitchCheckDefaultXL"
                    onChange={handleToggleOnChange}
                    checked={switchState}
                  />
                </CCol>

                <CCol className="d-flex align-items-center justify-content-center header-notification-bell" onClick={() => handleNotificationOnClick()}>
                  {unReadCount == 0 ?
                    null
                    :
                    <CBadge color="danger" shape="rounded-pill" className="notification-badge">
                      {unReadCount}
                    </CBadge>
                  }
                  <CIcon icon={cilBell} size="lg" />
                </CCol>
              </CRow>
            </CHeaderNav>
          )}

          <CHeaderNav className="ms-3">
            <AppHeaderDropdown handleLogout={handleLogout} userData={userData} />
          </CHeaderNav>

          {/* Mobile menu dropdown */}
          {isMobile && mobileMenuOpen && (
            <CDropdown variant="nav-item" popper={false} visible={mobileMenuOpen} className="mobile-menu-dropdown">
              <CDropdownMenu placement="bottom-end" className="mobile-dropdown-menu">
                {location.pathname === '/orders' && (
                  <CDropdownItem className="mobile-menu-item">
                    <CurrencyController mobileView={true} />
                  </CDropdownItem>
                )}
                
                <CDropdownItem className="mobile-menu-item" onClick={() => { handleSupportReqClick(); setMobileMenuOpen(false); }}>
                  <div className="menu-icon-wrapper">
                    <CIcon icon={cilHeadphones} />
                    {supportRequestCount > 0 && (
                      <CBadge color="danger" shape="rounded-pill" className="mobile-notification-badge">
                        {supportRequestCount}
                      </CBadge>
                    )}
                  </div>
                  <span>Support Center</span>
                </CDropdownItem>
                
                <CDropdownItem className="mobile-menu-item">
                  <div className="status-toggle-mobile">
                    <span className="status-label">Status: {switchState ? 'Active' : 'Inactive'}</span>
                    <CFormSwitch
                      size="lg"
                      id="mobileStatusSwitch"
                      onChange={handleToggleOnChange}
                      checked={switchState}
                    />
                  </div>
                </CDropdownItem>
                
                <CDropdownItem className="mobile-menu-item" onClick={() => { handleNotificationOnClick(); setMobileMenuOpen(false); }}>
                  <div className="menu-icon-wrapper">
                    <CIcon icon={cilBell} />
                    {unReadCount > 0 && (
                      <CBadge color="danger" shape="rounded-pill" className="mobile-notification-badge">
                        {unReadCount}
                      </CBadge>
                    )}
                  </div>
                  <span>Notifications</span>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          )}
        </CContainer>

        <CHeaderDivider />

        <CContainer fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
      
      <SupportSidebar
        show={supportSidebarVisible}
        onHide={() => setSupportSidebarVisible(false)}
        getHelpCount={getHelpCount}
      />
    </>
  );
};

export default AppHeader;