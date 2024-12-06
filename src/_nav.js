import React, { useContext } from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilAddressBook, cilUserPlus, cilGrain, cilUserX, cilCart, cilGarage, cilBook, cilEnvelopeLetter, cilChatBubble, cilSettings } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { UserLoginContext } from 'src/Context/UserLoginContext'



function getNavigationHook(permissions){

  const accountsPermissions =  [
      "all accounts access",
      "view customer orders",
      "approve customer orders",
      "reject customer orders",
      "view customer order pnl",
      "download account order long itinerary",
      "download account order short itinerary",
      "view refund customer request",
      "confirm refund customer request",
     
    ];
  
  const _nav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Orders',
      to: '/orders',
      icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Other',
    },
    {
      component: CNavItem,
      name: 'Vendors',
      to: '/vendors',
      hidden: false,
      icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Customers',
      to: '/customers',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Sales Analytics',
      to: '/sales',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Products',
      to: '/products',
      icon: <CIcon icon={cilGrain} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Accounts',
      to: '/accounts',
      hidden: !permissions.some(permission => accountsPermissions.includes(permission)),
      icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Customer Orders',
          to: '/accounts/customerorders',
        },
        {
          component: CNavItem,
          name: 'Refund Requests',
          to: '/accounts/refundRequests',
        }
      ],
    },
    {
      component: CNavItem,
      name: 'Chat',
      to: '/Chats',
      icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Reports',
      to: '/reporting',
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'All Reports',
          to: '/reporting/all',
        },
        {
          component: CNavItem,
          name: 'Accounts Reports',
          to: '/reporting/accounts',
        }
      ],
    },
  
  
    // {
    //   component: CNavItem,
    //   name: 'Emails',
    //   to: '/emails',
    //   icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
    // },
    {
      component: CNavGroup,
      name: 'Emails',
      to: '/emails',
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Resend Emails',
          to: '/emails/all',
        },
        {
          component: CNavItem,
          name: 'Generate Emails',
          to: '/emails/generate',
        }
      ],
    },
    {
      component: CNavItem,
      name: 'Access',
      to: '/user/access/manage',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      hidden: !permissions.includes("manage user access"),
    },
  ]

  return _nav;
}




export default getNavigationHook
