
import React, { Component, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

//  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

axios.defaults.baseURL = 'http://192.168.62.168:8000/api/'
axios.defaults.data = 'http://192.168.62.168:8000'

// axios.defaults.baseURL = 'https://admin-api.aahaas.com/api'
// axios.defaults.data = 'https://admin-api.aahaas.com'

// const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
// if (csrfTokenMeta) {
//   axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfTokenMeta.getAttribute('content');
// } else {
//   console.error('CSRF token meta tag not found');
// }

//
// axios.defaults.baseURL = 'http://192.168.8.110:8000/api/'
// axios.defaults.data = 'http://192.168.8.110:8000'
// axios.defaults.baseURL = 'http://192.168.1.4:8000/api/';

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

function App() {

  const data = localStorage.getItem('token');

  console.log(data, 'Data Value iss')

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          {/* Route for the login page */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          {/* Route for the register page */}
          <Route exact path="/register" name="Register Page" element={<Register />} />
          {/* Routes accessible only when authenticated */}

          <Route exact path="*" element={<DefaultLayout />} />

        </Routes>
      </Suspense>
    </HashRouter>
  );

}

export default App;
