import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CCardText, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import logo from '../assets/brand/aahaas.png'
import './AppSidebar.css';
import getNavigationHook from '../_nav'
import { UserLoginContext } from 'src/Context/UserLoginContext'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { userData } = useContext(UserLoginContext);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img src={logo} height={40}></img>

      </CSidebarBrand>




      <CSidebarNav className='sideBarSub'>
        <SimpleBar>
          <AppSidebarNav items={getNavigationHook(userData.permissions)} />
        </SimpleBar>



      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      /> */}
      <CCardText style={{ textAlign: 'center', padding: 10, color: '#AAAEB0' }}>V1.1.10</CCardText>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
