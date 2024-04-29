import React, { Component, Suspense } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import './scss/style.scss';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

//  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// axios.defaults.baseURL = 'http://172.16.26.67:8000/api/'
// axios.defaults.data = 'http://172.16.26.67:8000'

// axios.defaults.baseURL = 'https://admin-api.aahaas.com/api'
// axios.defaults.data = 'https://admin-api.aahaas.com'

axios.defaults.baseURL = 'http://172.16.26.245:8000/api/'
axios.defaults.data = 'http://172.16.26.245:8000'


// const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
// if (csrfTokenMeta) {
//   axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfTokenMeta.getAttribute('content');
// } else {
//   console.error('CSRF token meta tag not found');
// }

// axios.defaults.baseURL = 'http://192.168.8.110:8000/api/'
// axios.defaults.data = 'http://192.168.8.110:8000'
axios.defaults.baseURL = 'http://192.168.1.4:8000/api/';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false, // Track user authentication status
    };
  }

  componentDidMount() {
    // Check if user is already authenticated (e.g., check localStorage or sessionStorage)
    const isAuthenticated = localStorage.getItem('token') !== null; // Example: Check if token exists in localStorage
    this.setState({ isAuthenticated });
  }

  render() {
    const { isAuthenticated } = this.state;

    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            {/* Redirect to login if not authenticated */}
            {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
            {/* Redirect to register if not registered */}
            {!isAuthenticated && <Route path="login/*" element={<Navigate to="/register" />} />}
            {/* Protected routes */}
            <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    );
  }
}

export default App;
