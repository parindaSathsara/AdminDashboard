import axios from 'axios'
import React, { Component, Suspense, useEffect, useState, useRef } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { UserLoginContext } from './Context/UserLoginContext'
import InAppNotificationService from './service/InAppNotificationService'
import { CurrencyContext } from './Context/CurrencyContext'
import './scss/style.scss'
import './App.css';
import UserCountStats from './Panels/UserCount/UserCountStats'
import NotificationContainer from './components/Notification/NotificationContainer'
import BeepSound from 'src/assets/beep-sound.mp3';
import { db } from 'src/firebase';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'


axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

//  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
//


axios.defaults.imageUrl = 'https://dev-gateway.aahaas.com/';
axios.defaults.baseURL = 'https://staging-admin-api.aahaas.com/api';
axios.defaults.data = 'https://staging-admin-api.aahaas.com';
axios.defaults.url = 'https://dev-gateway.aahaas.com/api';



// axios.defaults.imageUrl = 'http://192.16.26.54:8000/';
// axios.defaults.baseURL = 'http://192.16.26.54:8000/api';
// axios.defaults.data = 'http://192.16.26.54:8000';
// axios.defaults.url = 'http://192.16.26.54:8000/api';


// axios.defaults.imageUrl = 'https://gateway.aahaas.com/';
// axios.defaults.baseURL = 'https://admin-api.aahaas.com/api'
// axios.defaults.data = 'https://admin-api.aahaas.com'
// axios.defaults.url = 'https://gateway.aahaas.com/api';

// axios.defaults.baseURL = 'http://172.16.26.67:8000/api'
// axios.defaults.data = 'http://172.16.26.67:8000'
// axios.defaults.baseURL = 'http://192.16.26.61:8000/api'
// axios.defaults.data = 'http://192.16.26.61:8000'

// axios.defaults.baseURL = 'http://172.16.26.238:8000/api'
// axios.defaults.data = 'http://172.16.26.238:8000'

// axios.defaults.baseURL = 'http://172.16.26.121:8000/api'
// axios.defaults.data = 'http://172.16.26.121:8000'

// const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
// if (csrfTokenMeta) {
//   axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfTokenMeta.getAttribute('content');
// } else {
//   console.error('CSRF token meta tag not found');
// }

// axios.defaults.baseURL = 'http://192.16.26.70:8000/api/'
// axios.defaults.data = 'http://192.16.26.70:8000'
// axios.defaults.baseURL = 'http://192.168.1.4:8000/api/';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // console.log(token,"Token value id is")
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    // console.log(`Bearer ${token}`)

  }
  else {
    window.location.href = '/#/login';
  }
  return config;
})

axios.interceptors.response.use(
  (response) => {
    return response; // If the response is successful, simply return it
  },
  (error) => {

    const status = error.response ? error.response.status : null;


    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/#/login';
      // console.log("Auth Checking User", error)
    }

    else if (status === 500) {

      console.error('A server error occurred. Please try again later.');

    } else if (status === 404) {

      console.error('The requested resource was not found.');

    } else if (status >= 400 && status < 500) {

      console.error('A client error occurred:', error.response.data);

    } else {

      console.error('An unknown error occurred.');

    }

    return Promise.reject(error);
  }
);

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

  const userid = localStorage.getItem("userID");

  window.addEventListener('unhandledrejection', function (event) {
    event.preventDefault();
    console.error('Unhandled promise rejection:', event.reason.message);
  });

  const [userLogin, setUserLogin] = useState(false)
  const [userData, setUserData] = useState(false)
  const [currencyData, setCurrencyData] = useState([])

  useEffect(() => {
    if (userid) {
      const userDataVal = JSON.parse(localStorage.getItem('user'));
      setUserData(userDataVal);
      setUserLogin(true);
      // axios.get(`getCurrency/${"USD"}`).then(response => {
      //   if (response?.data?.status == 200) {
      //     console.log(response.data, "Currency Data")
      //     setCurrencyData(response.data);
      //   }
      // });
    }
  }, [userid]);

  useEffect(() => {
    const currencyDataVal = localStorage.getItem('currencyData');

    console.log(currencyDataVal, "Currency Data value is 123")

    if (currencyDataVal) {
      setCurrencyData(JSON.parse(currencyDataVal));
    } else {
      axios.get(`getCurrency/${"USD"}`).then(response => {
        if (response?.data?.status == 200) {
          console.log(response.data, "Currency Data");
          setCurrencyData(response.data);
          localStorage.setItem('currencyData', JSON.stringify(response.data));
        }
      });
    }

    useChatNotifications();
  }, []);




  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!userLogin) {
        console.log("User logged as guest");
        window.location.href = '/#/login';
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [userLogin]);

  const [notifications, setNotifications] = useState([]);

  const addNotification = (newChat, chatId) => {
    const audio = new Audio(BeepSound);
    audio.play().catch((error) => {
      console.log('Audio play failed:', error);
    });

    const id = Date.now();
    const newNotification = {
      id: chatId.toString(),
      image: newChat?.chat_avatar ?? "https://aahaas-appqr.s3.ap-southeast-1.amazonaws.com/Logo+Resize+3.png",
      title: 'A New Chat Has Arrived!',
      description: newChat?.chat_name,
      user_name: newChat?.last_message?.name,
      message: newChat?.last_message?.value
    };

    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== chatId.toString()));
    }, 5000); // 5 seconds
  };

  const isFirstSnapshot = useRef(true);
  const useChatNotifications = () => {
    const q = query(collection(db, "customer-chat-lists"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const newChat = change.doc.data();
          const chatId = change.doc.id;
          if (newChat.admin_unreads != 0) {
            addNotification(newChat, chatId);
          }
        }
      });
    });

    return () => unsubscribe();
  };

  return (
    <CurrencyContext.Provider value={{ currencyData, setCurrencyData }}>
      <UserLoginContext.Provider value={{ userLogin, setUserLogin, userData, setUserData }}>
        <NotificationContainer notifications={notifications} />
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              {
                !userLogin ?
                  <>


                    <Route exact path="/" name="Login Page" element={<Login />} errorElement={<Page404></Page404>} />
                    <Route exact path="/login" name="Login Page" element={<Login />} errorElement={<Page404></Page404>} />
                    <Route exact path="/register" name="Register Page" element={<Register />} errorElement={<Page404></Page404>} />
                    <Route exact path="*" name="404" element={<Page404 />} errorElement={<Page404></Page404>} />
                  </>
                  :
                  <>
                    {/* <Route exact path="/login" name="Login Page" element={<Login />} errorElement={<Page404></Page404>} />
                <Route exact path="/register" name="Register Page" element={<Register />} errorElement={<Page404></Page404>} /> */}
                    <Route exact path="*" element={<DefaultLayout />} errorElement={<Page404></Page404>} />
                    <Route exact path="/users/stats" element={<UserCountStats />} errorElement={<Page404></Page404>} />

                  </>
              }
            </Routes>
          </Suspense>
        </HashRouter>
      </UserLoginContext.Provider>
    </CurrencyContext.Provider>

  );

}

export default App;
