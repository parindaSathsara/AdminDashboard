import React, { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { CCardText, CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/brand/aahaas.png'
import './AppSidebar.css'
import getNavigationHook from '../_nav'
import { UserLoginContext } from 'src/Context/UserLoginContext'

// Import SimpleBar and its CSS
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { userData } = useContext(UserLoginContext);
  const [version, setVersion] = useState('');

  useEffect(() => {
    axios.get('/version')
      .then(response => {
        setVersion(response.data.version);
      })
      .catch(error => {
        console.error('Failed to fetch version:', error);
      });
  }, []);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      className="sidebar-container"
    >
      <CSidebarBrand className="d-none d-md-flex sidebar-brand">
        <img src={logo} height={40} alt="Aahaas Logo" />
      </CSidebarBrand>

      <CSidebarNav className="sidebar-nav">
        <SimpleBar 
          style={{ 
            maxHeight: 'calc(100vh - 120px)', 
            width: '100%',
            overflowY: 'auto'
          }}
          className="custom-scrollbar"
        >
          <AppSidebarNav items={getNavigationHook(userData.permissions)} />
        </SimpleBar>
      </CSidebarNav>

      <div className="sidebar-footer">
        <CCardText className="version-text">{version}</CCardText>
      </div>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)