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
import EmailDashboard from './views/EmailDashboard/EmailDashboard'
import ChatsMeta from './views/_Chats/ChatsMeta/ChatsMeta'

const Dashboard = React.lazy(() => import('./views/dashboard/Orders'))
const Sales = React.lazy(() => import('./views/Sales/Sales'))

const AccountsRefunds = React.lazy(() => import('./views/Departments/AccountsDepartment/AccountsRefund'))
const AccountsDepartment = React.lazy(() => import('./views/Departments/AccountsDepartment/AccountsDepartment.jsx'))
const DeliveryDepartment = React.lazy(() => import('./views/Departments/DeliveryDepartment/DeliveryDepartment.jsx'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const AccountSystem = React.lazy(() => import('./views/theme/AccountSystem/AccountSystem'))
const ChatsHome = React.lazy(() => import('./views/Chats/Chatshome'))
const ChatsIndex = React.lazy(() => import('./views/_Chats/ChatsIndex'))


// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

const routes = [
  { path: '/', exact: true, name: 'Home' },





  { path: '/offers_promo', name: 'Promotions & Offers', element: OffersPromoDashboard, exact: true },

  { path: '/vendors', name: 'Vendors', element: VendorList, exact: true },
  { path: '/vendors/analytics', name: 'Vendor Analytics', element: VendorAnalytic },
  { path: '/dashboard', name: 'Dashboard', element: MainDashboard, exact: true },

  { path: '/orders', name: 'Orders', element: Dashboard, exact: true },

  // { path: '/sales', name: 'Sales', element: Sales, exact: true },
  { path: '/accounts', name: 'Sales', element: AccountsDepartment },
  { path: '/accounts/refundRequests', name: 'Refunds', element: AccountsRefunds },

  { path: '/products', name: 'Products', element: ProductList },
  { path: '/products/analytics', name: 'Product Analytics', element: ProductAnalytics },
  { path: '/sales', name: 'Sales Analytics', element: SalesAnalytics, exact: true },

  { path: '/theme/chats', name: 'chats', element: ChatsHome, exact: true },
  { path: '/Chats', name: 'Chats', element: ChatsMeta, exact: true },

  { path: '/reporting', name: 'Reports', element: ReportsMain, exact: true },
  { path: '/emails', name: 'Email Dashboard', element: EmailDashboard, exact: true },

  { path: '/delivery', name: 'Delivery', element: DeliveryDepartment, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/customers', name: 'Customers', element: Typography },
  { path: '/theme/AccountSystem', name: 'AccountSystem', element: AccountSystem },
  { path: '/base', name: 'Base', element: MoreOrderView, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets }
  // { path: "/login", name: 'login', element: Login },
  // { path: "/register", name: 'register', element: Register }

]

export default routes
