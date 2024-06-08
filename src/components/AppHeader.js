import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  CFormSwitch,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilEnvelopeOpen, cilExitToApp, cilList, cilMenu } from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
import logo from '../assets/brand/aahaas.png';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { adminToggleStatus } from 'src/service/api_calls';

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const navigate = useNavigate();

  const { userLogin, setUserLogin, userData, setUserData } = useContext(UserLoginContext);




  const handleLogout = () => {
    // Clear all user sessions
    sessionStorage.clear(); // Clears session storage
    localStorage.clear(); // Clears local storage

    setUserLogin(false);
    navigate('/login');
  };

  console.log('User Data is', userData);

  const [switchState, setSwitchState] = useState(false);

  const handleToggleOnChange = (e) => {
    const newSwitchState = e.target.checked;
    setSwitchState(newSwitchState);
    localStorage.setItem('userActive', newSwitchState);
    console.log(newSwitchState, 'Checked Value');

    adminToggleStatus("Active")
  };

  useEffect(() => {
    const userActive = JSON.parse(localStorage.getItem('userActive'));
    console.log('User Active status is', userActive);
    setSwitchState(userActive);
  }, []);

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
        <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>
        <CHeaderNav>
          <CRow>
            <CFormSwitch
              size="xl"
              label={switchState ? 'Active' : 'Inactive'}
              id="formSwitchCheckDefaultXL"
              onChange={handleToggleOnChange}
              checked={switchState}
            />
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
    </CHeader >
  );
};

export default AppHeader;
