import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilAddressBook, cilUserPlus, cilGrain, cilUserX, cilCart, cilGarage, cilBook, cilEnvelopeLetter, cilChatBubble } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
  // {
  //   component: CNavItem,
  //   name: 'Orders allocations',
  //   to: '/allocation',
  //   icon: <CIcon icon={cilGarage} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Orders calendar',
    to: '/order-calendar',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Other',
  },
  // {
  //   component: CNavItem,
  //   name: 'Sales',
  //   to: '/sales',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavItem,
  //   name: 'Promotions & Offers',
  //   to: '/offers_promo',
  //   icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  // },

  {
    component: CNavItem,
    name: 'Vendors',
    to: '/vendors',
    icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
    // items: [
    //   {
    //     component: CNavItem,
    //     name: 'Vendors',
    //     to: '/vendors/',
    //   },
    //   {
    //     component: CNavItem,
    //     name: 'Vendor Analytics',
    //     to: 'vendors/analytics',
    //   },

    // ],
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
    // items: [
    //   {
    //     component: CNavItem,
    //     name: 'Products',
    //     to: '/products/',
    //   },
    //   // {
    //   //   component: CNavItem,
    //   //   name: 'Product Analytics',
    //   //   to: 'products/analytics',
    //   // },

    // ],
  },




  {
    component: CNavGroup,
    name: 'Accounts',
    to: '/accounts',
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




  // {
  //   component: CNavItem,
  //   name: 'Delivery',
  //   to: '/delivery',
  //   icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Testing',
  //   to: '/theme/Testing',
  //   icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Chat',
    to: '/Chats',
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Reports',
    to: '/reporting',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },


  {
    component: CNavItem,
    name: 'Emails',
    to: '/emails',
    icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Education',
    to: '/education',
    icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
  },



  // {
  //   component: CNavItem,
  //   name: 'Testing',
  //   to: '/theme/Testing',
  //   icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Buttons',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Dropdowns',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
