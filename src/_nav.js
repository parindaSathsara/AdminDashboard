import React, { useContext } from 'react'
import CIcon from '@coreui/icons-react'

import { cilSpeedometer, cilUser, cilAddressBook, cilUserPlus, cilGrain, cilUserX, cilCart, cilGarage, cilBook, cilEnvelopeLetter, cilChatBubble, cilSettings,cilBarChart, cilCommentSquare, cilAlbum, cilReportSlash, cilCloudDownload, cilCloudUpload, cilNewspaper, cilVolumeLow, cilPuzzle, cilChart } from '@coreui/icons'
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

    const promotionPermissions =  [
      "manage offers",
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
    // {
    //   component: CNavItem,
    //   name: 'Orders allocations',
    //   to: '/allocation',
    //   icon: <CIcon icon={cilGarage} customClassName="nav-icon" />,
    // },
    // {
    //   component: CNavItem,
    //   name: 'Orders calendar',
    //   to: '/order-calendar',
    //   icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    // },
    {
      component: CNavTitle,
      name: 'Other',
    },
    // {
    //   component: CNavItem,
    //   name: 'Sales',
    //   to: '/sales',
    //   icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
    // },
  
    {
      component: CNavItem,
      name: 'Discounts',
      to: '/offers_promo',
      icon: <CIcon icon={cilVolumeLow} customClassName="nav-icon" />,
      hidden: !permissions.some(permission => promotionPermissions.includes(permission)),
    },
  
    {
      component: CNavItem,
      name: 'Vendors',
      to: '/vendors',
      hidden:false,
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
  
  
    // {
    //   component: CNavItem,
    //   name: 'Customers',
    //   to: '/customers',
    //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    // },
    {
      component: CNavGroup,
      name: 'Customers',
      to: '/customers',
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Customers',
          to: '/customers',
        },
         {
           component: CNavItem,
          name: 'Customer Analytics',
           to: '/analytics',
         }
      ],
    },
    {
      component: CNavItem,
      name: 'Sales Analytics',
      to: '/sales',
      icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
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
      component: CNavGroup,
      name: 'Reports',
      to: '/reporting',
      icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
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
    {
      component: CNavGroup,
      name: 'Blogs',
      to: '/blogs',
      icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Add Blog',
          to: '/blogs/newBlog',
        },
        {
          component: CNavItem,
          name: 'List Blogs',
          to: '/blogs/listBlogs',
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
      icon: <CIcon icon={cilCloudDownload} customClassName="nav-icon" />,
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
  //  {
  //   component:CNavItem,
  //   name:'Customer Analytics',
  //   to:'/analytics',
  //   icon: <CIcon icon={cilBarChart}  customClassName="nav-icon"/>
  // },
  // {
  //   component:CNavItem,
  //   name:'Push Notifications',
  //   to:'/pushNotifications',
  //   icon: <CIcon icon={cilCommentSquare}  customClassName="nav-icon"/>
  // },
    {
      component: CNavItem,
      name: 'Supplier Support',
      to: '/supplier/support',
      icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
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
