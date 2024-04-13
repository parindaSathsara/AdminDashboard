/* eslint-disable */

import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

// src\views\pages\login\Login.js
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Set the CSRF token as a default header for all Axios requests
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

//  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// axios.defaults.baseURL = 'http://172.16.26.243:8000/api/'
// axios.defaults.data = 'http://172.16.26.243:8000'

// axios.defaults.baseURL = 'https://admin-api.aahaas.com/api'
// axios.defaults.data = 'https://admin-api.aahaas.com'

// axios.defaults.baseURL = 'http://192.168.1.4:8000/api/'
// axios.defaults.data = 'http://192.168.1.4:8000'


// const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
// if (csrfTokenMeta) {
//   axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfTokenMeta.getAttribute('content');
// } else {
//   console.error('CSRF token meta tag not found');
// }

axios.defaults.baseURL = 'http://192.168.8.110:8000/api/'
axios.defaults.data = 'http://192.168.8.110:8000'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path='' element={<Login />}></Route>
            <Route exact path='*' element={<DefaultLayout />}></Route>
            {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
