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





  const location = useLocation();
  useEffect(() => {

  console.log('xwnwekCurrent pathname:', location.pathname);
  console.log('xwnwekSearch params:', location.search);
  console.log('xwnwekHash:', location.hash);
  console.log('xwnwekState:', location.state);

    const userActive = JSON.parse(localStorage.getItem('userActive'));
    setSwitchState(userActive);
  }, []);




  const [unReadCount, setUnReadCount] = useState(0)
  const [newHotList, setNewHotList] = useState([])

  // useEffect(() => {
  //   const fetchNotifications = () => {
  //     // fetchInAppNotificationsCount(userData?.id).then(response => {
  //     //   console.log(response, "Read Notification")
  //     //   setUnReadCount(response);

  //     // });
  //     readInAppNotificationsOrderWise().then(response => {
  //       // console.log(response?.data?.data?.notifications, "Read Notification")
  //       setUnReadCount(response?.data?.data?.unread_count);
  //       setNewHotList(response?.data?.data?.notifications);
  //     });
  //   };

  //   fetchNotifications(); // Initial call

  //   const intervalId = setInterval(fetchNotifications, 10000); // Call every 10 seconds

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [userData?.id]);



  const [hotListSide, setHotListSide] = useState(false)
  const [hotList, setHotList] = useState([])
  const [supportRequestCount, setSupportRequestCount] = useState(0);
  const [supportReqests, setSupportReqests] = useState([]);
  const [supportSidebarVisible, setSupportSidebarVisible] = useState(false);


  const getHotList = () => {
    fetchInAppNotifications(userData?.id).then(res => {
      console.log(res, "Hotlist")
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

  useState(() => {
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
    // .
    // catch((err) => {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Error fetching data!"
    //   });
    //   throw new Error(err)
    // })
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
          <HotList increaseNotification={handleIncreaseNotification} display={hotListSide} data={newHotList}></HotList>
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
                {location.pathname !== '/dashboard' && <CurrencyController />}
              </CCol>

              {/* <CCol className="d-flex align-items-center justify-content-center currency-col">
              <div className="supportCenter" style={{color:'black'}}><CIcon icon={cilHeadphones} /></div>
              </CCol> */}
              <CCol className="d-flex align-items-center justify-content-center header-notification-bell" onClick={() => handleSupportReqClick()}>
                {supportRequestCount === 0 ?
                  null
                  :
                  <CBadge color="danger" shape="rounded-pill" style={{ position: 'absolute', top: 10, marginLeft: 20 }}>
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
      {/* <SupportSidebar
      visible={supportSidebarVisible}
      onClose={() => setSupportSidebarVisible(false)}
    /> */}
      <SupportSidebar
        show={supportSidebarVisible}
        onHide={() => setSupportSidebarVisible(false)}
        getHelpCount={getHelpCount}
      />
    </>

  );
};

export default AppHeader;
