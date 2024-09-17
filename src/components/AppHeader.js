import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilMenu } from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
import logo from '../assets/brand/aahaas.png';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { adminToggleStatus } from 'src/service/api_calls';
import CurrencyController from './CurrencyController';
import HotList from 'src/views/HotList/HotList';
import { fetchInAppNotifications, fetchInAppNotificationsCount, readInAppNotifications } from 'src/views/HotList/service/HotListServices';

import './AppHeader.css'
import axios from 'axios';

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navigate = useNavigate();
  const { userLogin, setUserLogin, userData, setUserData } = useContext(UserLoginContext);

  const handleLogout = async () => {
    // Clear all user sessions


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





  useEffect(() => {
    const userActive = JSON.parse(localStorage.getItem('userActive'));
    setSwitchState(userActive);
  }, []);




  const [unReadCount, setUnReadCount] = useState(0)


  useEffect(() => {
    const fetchNotifications = () => {
      fetchInAppNotificationsCount(userData?.id).then(response => {

        setUnReadCount(response);

      });
    };

    fetchNotifications(); // Initial call

    const intervalId = setInterval(fetchNotifications, 10000); // Call every 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [userData?.id]);



  const [hotListSide, setHotListSide] = useState(false)
  const [hotList, setHotList] = useState([])


  const getHotList = () => {
    fetchInAppNotifications(userData?.id).then(res => {
      setHotList(res)

    })
  }










  const handleNotificationOnClick = () => {
    setHotListSide(!hotListSide)
    getHotList()
    readInAppNotifications(userData?.id)

    fetchInAppNotificationsCount(userData?.id).then(response => {

      setUnReadCount(response);

    });
    // userData?.id
  }




  const handleIncreaseNotification = () => {

  }

  return (


    <>

      <COffcanvas backdrop={true} placement="end" visible={hotListSide} dark >
        <COffcanvasHeader>
          <COffcanvasTitle>Hotlist</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => handleNotificationOnClick()} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <HotList increaseNotification={handleIncreaseNotification} display={hotListSide} data={hotList}></HotList>
        </COffcanvasBody>
      </COffcanvas>

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

          <CHeaderNav className="d-none d-md-flex me-auto" />

          <CHeaderNav>
            <CRow className="align-items-center">


              <CCol className="d-flex align-items-center justify-content-center currency-col">
                <CurrencyController />
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

                  <CBadge color="danger" shape="rounded-pill" style={{ position: 'absolute', top: 10, marginLeft: 20 }}>
                    {unReadCount}
                  </CBadge>
                }

                <CIcon icon={cilBell} size="lg" />
              </CCol>

            </CRow>
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
    </>

  );
};

export default AppHeader;
