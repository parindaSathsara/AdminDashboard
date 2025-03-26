import React from 'react'
import VendorList from './views/VendorList/VendorList'
import VendorAnalytic from './views/VendorList/VendorAnalytics'
import ProductList from './views/Products/ProductsList'
import ProductAnalytics from './views/Products/ProductAnalytics'
import SalesAnalytics from './views/SalesAnalytics/SalesAnalytics'
import MoreOrderView from './Panels/OrderDetails/MoreOrderView/MoreOrderView'
import MainDashboard from './views/MainDashboard/MainDashboard'
import OffersPromoDashboard from './views/OffersPromo/OffersPromoDashboard'
import ReportsMain from './views/Reports/ReportsMain'
import AccountReport from './views/Reports/AccountReport'
import EmailDashboard from './views/EmailDashboard/EmailDashboard'
import ChatsMeta from './views/_Chats/ChatsMeta/ChatsMeta'
import FlightsmainPage from './views/Flights/FlightsmainPage'
import PushNotifications from './Panels/PushNotifications/PushNotifications'
import FlightOrderView from './views/dashboard/FlightUI/FlightOrderView'
import Typography from './views/theme/typography/Typography'
import AllocationsHomepage from './views/Allocations/AllocationsHomepage'
import OrderCalenderhomepage from './views/Order-calender/OrderCalender-homepage'
import UserAnalytics from './Panels/UserAnalytics/UserAnalytics'
import BlogMainPage from './Panels/BlogWriting/BlogMainPage'
import SupplierSupport from './views/SupplierSupport/SupplierSupport'
import KpiDashboard from './views/KPIDashboard/KpiDashboard'
import GlobalTarget from './views/KPIDashboard/GlobleTarget'
import ChatAnalytics from './views/KPIDashboard/ChatAnalytics'



const Dashboard = React.lazy(() => import('./views/dashboard/Orders'))
const Sales = React.lazy(() => import('./views/Sales/Sales'))

const AccountsRefunds = React.lazy(() => import('./views/Departments/AccountsDepartment/AccountsRefund'))
const AccountsDepartment = React.lazy(() => import('./views/Departments/AccountsDepartment/AccountsDepartment.jsx'))
const DeliveryDepartment = React.lazy(() => import('./views/Departments/DeliveryDepartment/DeliveryDepartment.jsx'))

const ChatsHome = React.lazy(() => import('./views/Chats/Chatshome'))
const ChatsIndex = React.lazy(() => import('./views/_Chats/ChatsIndex'))
const UserAccessManage = React.lazy(() => import('./views/ManageAccess/AccessManagement'))
const EmailGeneration = React.lazy(() => import('./views/EmailDashboard/EmailGeneration'))
import ListBlogs from './Panels/BlogWriting/ListBlogs'
import VIewBlog from './Panels/BlogWriting/VIewBlog'

// // Base
// // const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/base/cards/Cards'))
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
// const Navs = React.lazy(() => import('./views/base/navs/Navs'))
// const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
// const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
// const Progress = React.lazy(() => import('./views/base/progress/Progress'))
// const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
// const Tables = React.lazy(() => import('./views/base/tables/Tables'))
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
// const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
// const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
import AccessManagement from './views/ManageAccess/AccessManagement';
import Bridgify from './Panels/API_details/Bridgify'
import TBO from './Panels/API_details/TBO'
import UserCountStats from './Panels/UserCount/UserCountStats'

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/supplier/support', name: 'Supplier Support', element: SupplierSupport, exact: true },
  { path: '/user/access/manage', name: 'Manage Access', element: UserAccessManage, exact: true },
  { path: '/flightCard', name: 'Flights', element: FlightOrderView, exact: true },
  { path: '/blogs/newBlog', name: 'Add Blog', element: BlogMainPage, exact: true },
  { path: '/blogs/listBlogs', name: 'List Blogs', element: ListBlogs, exact: true },
  { path: '/blogs/viewBlog/:id', name: 'View Blog', element: VIewBlog, exact: true },

  { path: '/offers_promo', name: 'Discounts', element: OffersPromoDashboard, exact: true },

  { path: '/vendors', name: 'Vendors', element: VendorList, exact: true },
  { path: '/vendors/analytics', name: 'Vendor Analytics', element: VendorAnalytic },
  { path: '/dashboard', name: 'Dashboard', element: MainDashboard, exact: true },

  { path: '/orders', name: 'Orders', element: Dashboard, exact: true },

  // { path: '/sales', name: 'Sales', element: Sales, exact: true },
  { path: '/accounts/customerorders', name: 'Sales', element: AccountsDepartment },
  { path: '/accounts/refundRequests', name: 'Refunds', element: AccountsRefunds },

  { path: '/products', name: 'Products', element: ProductList },
  { path: '/products/analytics', name: 'Product Analytics', element: ProductAnalytics },
  { path: '/sales', name: 'Sales Analytics', element: SalesAnalytics, exact: true },

  { path: '/theme/chats', name: 'chats', element: ChatsHome, exact: true },
  { path: '/Chats', name: 'Chats', element: ChatsMeta, exact: true },

  { path: '/reporting/accounts', name: 'Accounts Report', element: AccountReport },
  { path: '/reporting/all', name: 'All Report', element: ReportsMain },
  { path: '/reporting', name: 'All Reports', element: ReportsMain, exact: true },

  { path: '/emails/generate', name: 'Email Generate', element: EmailGeneration },
  { path: '/emails/all', name: 'Email Resend', element: EmailDashboard },
  { path: '/emails', name: 'Email Dashboard', element: EmailDashboard, exact: true },

  { path: '/delivery', name: 'Delivery', element: DeliveryDepartment, exact: true },

  { path: '/customers', name: 'Customers', element: Typography },
  // { path: '/theme/AccountSystem', name: 'AccountSystem', element: AccountSystem },
  { path: '/base', name: 'Base', element: MoreOrderView, exact: true },



  // { path: "/login", name: 'login', element: Login },
  // { path: "/register", name: 'register', element: Register }

  // flights path
  { path: '/flights/*', name: 'Flights', element: FlightsmainPage },
  { path: '/pushNotifications/*', name: 'PushNotifications', element: PushNotifications },

  // driver and vechicle allocation
  { path: '/allocation', name: 'Orders Allocations', element: AllocationsHomepage, exact: true },

  {path: '/order-calendar', name: 'Orders calendar', element: OrderCalenderhomepage, exact: true },
  {path:'/analytics',name:'Analytics',element:UserAnalytics,exact:true},
  {path:'/kpidashboard',name:'KPI Dashboard',element:KpiDashboard,exact:true},
  {path:'/kpidashboard/team',name:'Team KPI',element:KpiDashboard},
  {path:'/kpidashboard/globaltarget',name:'Global Target',element:GlobalTarget},
  {path:'/kpidashboard/chat',name:'Chat Analytics',element:ChatAnalytics},
 

  // services 
  {path:'/services/bridgyfy',name:'Bridgify',element:Bridgify},
  {path:'/services/tbo',name:'TBO',element:TBO},
  {path:'/users/stats',name:'User Stats',element:UserCountStats},


]

export default routes
