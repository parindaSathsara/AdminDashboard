
import React, { Component, Suspense, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import axios from 'axios'
import { UserLoginContext } from './Context/UserLoginContext'
import InAppNotificationService from './service/InAppNotificationService'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

//  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// axios.defaults.baseURL = 'http://172.16.26.238:8000/api/'
// axios.defaults.data = 'http://172.16.26.238:8000'

axios.defaults.baseURL = 'https://admin-api.aahaas.com/api'
axios.defaults.data = 'https://admin-api.aahaas.com'

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
const Dashboard = React.lazy(() => import('./views/dashboard/Orders'));

function App() {



  const [userLogin, setUserLogin] = useState(false)
  const [userData, setUserData] = useState(false)





  useEffect(() => {
    const userid = localStorage.getItem("userID");

    if (userid) {
      const userDataVal = JSON.parse(localStorage.getItem('user'));
      setUserData(userDataVal)
      setUserLogin(true)
    }

  }, [])


  return (


    <UserLoginContext.Provider value={{ userLogin, setUserLogin, userData, setUserData }}>

      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>

            {!userLogin ?
              <>
                <Route exact path="/" name="Login Page" element={<Login />} errorElement={<Page404></Page404>} />
                <Route exact path="/login" name="Login Page" element={<Login />} errorElement={<Page404></Page404>} />
                <Route exact path="/register" name="Register Page" element={<Register />} errorElement={<Page404></Page404>} />
              </>

              :

              <>
                {/* <Route exact path="/login" name="Login Page" element={<Login />} errorElement={<Page404></Page404>} />
                <Route exact path="/register" name="Register Page" element={<Register />} errorElement={<Page404></Page404>} /> */}



                <Route exact path="*" element={<DefaultLayout />} errorElement={<Page404></Page404>} />
              </>


            }




          </Routes>
        </Suspense>
      </HashRouter>
    </UserLoginContext.Provider>
  );

}

export default App;
