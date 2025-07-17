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
import ChatAlert from 'src/assets/chat_alert.wav';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
axios.defaults.supplierUrl = 'https://staging-supplier.aahaas.com/';





// axios.defaults.imageUrl = 'http://192.16.26.54:8000/';
// axios.defaults.baseURL = 'http://192.16.26.54:8000/api';
// axios.defaults.data = 'http://192.16.26.54:8000';
// axios.defaults.url = 'http://192.16.26.54:8000/api';


// axios.defaults.imageUrl = 'https://gateway.aahaas.com/';
// axios.defaults.baseURL = 'https://admin-api.aahaas.com/api'
// axios.defaults.data = 'https://admin-api.aahaas.com'
// axios.defaults.url = 'https://gateway.aahaas.com/api';
// axios.defaults.supplierUrl = 'https://supplier.aahaas.com/';


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
const ForgetPassword = React.lazy(() => import('./views/pages/forgetpassword/ForgetPassword'));
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
  const [orderNotification, setOrderNotification] = useState(false)
  const [currencyData, setCurrencyData] = useState([])

  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(notifications);
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    notificationRef.current = notifications;
  }, [notifications]);

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
    // useOrderNotifications();
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

  const checkForNewOrders = async () => {
    try {
      const params = {};
      if (lastOrderId) params.last_order_id = lastOrderId;
      
      // const response = await axios.get('/fetch_new_orders', { params });
      const response = await axios.get('/fetch_new_orders', { params });
      const { orders, latest_order_id } = response.data;
  
      if (orders && orders.length > 0) {
        setLastOrderId(latest_order_id);
        
        // Get notified orders from cache
        const notifiedOrders = JSON.parse(localStorage.getItem('notifiedOrders') || '{}');
        let newNotifications = false;
  
        orders.forEach(order => {
          // Check if this order has already been notified
          if (!notifiedOrders[order.OrderId]) {
            // Mark as notified
            notifiedOrders[order.OrderId] = true;
            newNotifications = true;
            
            // Show notification
            const newChat = {
              chat_avatar: "",
              chat_name: `New Order #${order.OrderId}`,
              last_message: {
                name: "System",
                value: `New order (ID: ${order.OrderId}) received`
              }
            };
            setOrderNotification(true)
            // addNotification(newChat, order.OrderId);
            addNotification(newChat, order.OrderId, 'order');

            setOrderNotification(false)
          }
        });
  
        // Update cache if we had new notifications
        if (newNotifications) {
          localStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
        }
      }
    } catch (error) {
      console.error('Error checking for new orders:', error);
    }
  };
  
  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkForNewOrders, 100000);
    // Initial check
    checkForNewOrders();
    return () => clearInterval(interval);
  }, [lastOrderId]);



  // const addNotification = (newChat, chatId) => {
  //   const audio = new Audio(ChatAlert);
  //   audio.play().catch((error) => {
  //     console.log('Audio play failed:', error);
  //   });

  //   const id = Date.now();
  //   const newNotification = {
  //     id: chatId.toString(),
  //     // image: newChat?.chat_avatar ?? "https://aahaas-appqr.s3.ap-southeast-1.amazonaws.com/Logo+Resize+3.png",
  //     image: newChat?.chat_avatar?.trim() ? newChat.chat_avatar : "https://aahaas-appqr.s3.ap-southeast-1.amazonaws.com/Logo+Resize+3.png",

  //     title: 'A New Chat Has Arrived!',
  //     description: newChat?.chat_name,
  //     user_name: newChat?.last_message?.name,
  //     message: newChat?.last_message?.value
  //   };

  //   setNotifications(prev => [...prev, newNotification]);
  //   setTimeout(() => {
  //     setNotifications(prev => prev.filter(n => n.id !== chatId.toString()));
  //   }, 5000); // 5 seconds
  // };

  // Add a state to track recently notified chats
const [recentlyNotifiedChats, setRecentlyNotifiedChats] = useState({});

// const addNotification = (newChat, chatId) => {
//   console.log(newChat, "New Chat Data");
//   // Check if we've recently shown a notification for this chat
//   if (recentlyNotifiedChats[chatId]) {
//     return; // Skip showing another notification
//   }
  
//   const audio = new Audio(ChatAlert);
//   audio.play().catch((error) => {
//     console.log('Audio play failed:', error);
//   });
  
//   const id = Date.now();
//   const newNotification = {
//     id: chatId?.toString(),
//     image: newChat?.chat_avatar?.trim() ? (newChat.chat_avatar.includes(',') ? newChat.chat_avatar.split(',')[0] : newChat.chat_avatar): "https://aahaas-appqr.s3.ap-southeast-1.amazonaws.com/Logo+Resize+3.png",
//     title: orderNotification ? 'A New Order Has Arrived!' :'A New Chat Has Arrived!',
//     description: newChat?.chat_name,
//     user_name: newChat?.last_message?.name,
//     message: newChat?.last_message?.value
//   };
  
//   // Mark this chat as recently notified
//   setRecentlyNotifiedChats(prev => ({
//     ...prev,
//     [chatId]: true
//   }));
  
//   setNotifications(prev => [...prev, newNotification]);
  
//   setTimeout(() => {
//     setNotifications(prev => prev.filter(n => n.id !== chatId.toString()));
    
//     // After notification expires, remove from recently notified list
//     setRecentlyNotifiedChats(prev => {
//       const updated = {...prev};
//       delete updated[chatId];
//       return updated;
//     });
//   }, 5000); // 5 seconds
// };

const addNotification = (newChat, chatId, type = 'chat') => {
  console.log(newChat, "New Chat Data");

  if (recentlyNotifiedChats[chatId]) return;

  const audio = new Audio(ChatAlert);
  audio.play().catch((error) => {
    console.log('Audio play failed:', error);
  });

  const newNotification = {
    id: chatId?.toString(),
    image: newChat?.chat_avatar?.trim()
      ? (newChat.chat_avatar.includes(',') ? newChat.chat_avatar.split(',')[0] : newChat.chat_avatar)
      : "https://aahaas-appqr.s3.ap-southeast-1.amazonaws.com/Logo+Resize+3.png",
    title: type === 'order' ? 'A New Order Has Arrived!' : 'A New Chat Has Arrived!',
    description: newChat?.chat_name,
    user_name: newChat?.last_message?.name,
    message: newChat?.last_message?.value
  };

  setRecentlyNotifiedChats(prev => ({ ...prev, [chatId]: true }));
  setNotifications(prev => [...prev, newNotification]);

  setTimeout(() => {
    setNotifications(prev => prev.filter(n => n.id !== chatId.toString()));
    setRecentlyNotifiedChats(prev => {
      const updated = { ...prev };
      delete updated[chatId];
      return updated;
    });
  }, 5000);
};


const addNotification1 = (newChat, chatId) => {
  const audio = new Audio(ChatAlert);
  audio.play();
  
  setNotifications(prev => [
    ...prev,
    {
      id: chatId,
      title: newChat.chat_name,
      message: newChat.last_message.value,
      time: new Date().toLocaleTimeString(),
      icon: 'faBell'
    }
  ]);
};

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
  // const useOrderNotifications = () => {
  //   const unsubscribe = onSnapshot(
  //     query(collection(db, 'order_ids'), orderBy('updatedAt', 'desc')), // Order by updatedAt to get latest first
  //     (querySnapshot) => {
  //       if (!querySnapshot.empty) {
  //         console.log(querySnapshot.docs, "Order Notification Data issss");
          
  //         // Get the most recent order (first document in the sorted snapshot)
  //         const latestOrderDoc = querySnapshot.docs[0];
  //         const latestOrderData = latestOrderDoc.data();
  //         const latestOrderId = latestOrderDoc.id;
          
  //         console.log("Latest order:", latestOrderId, latestOrderData);
          
  //         // Check if this order has unreads before notifying
  //         if (latestOrderData.admin_unreads && latestOrderData.admin_unreads !== 0) {
  //           // Map order data to match the notification format expected by addNotification
  //           const formattedOrderData = {
  //             chat_avatar: latestOrderData.order_image || latestOrderData.product_image || '',
  //             chat_name: latestOrderData.order_name || latestOrderData.product_name || `Order #${latestOrderId}`,
  //             last_message: {
  //               name: latestOrderData.customer_name || 'Customer',
  //               value: latestOrderData.last_message || 'New order message'
  //             }
  //           };
            
  //           // Call the notification function with the formatted data
  //           addNotification(formattedOrderData, latestOrderId);
  //         }
  //       } else {
  //         console.log("No orders found.");
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching real-time data: ", error);
  //     }
  //   );
    
  //   return () => unsubscribe();
  // };
  const useOrderNotifications3 = () => {


    const q = query(collection(db, "order_ids"))
          const unsubscribe = onSnapshot(
            q, (querySnapshot) => {
              // querySnapshot.docChanges().forEach((change) => {
              //   console.log(change, "Customer Orders")
              //   if (change.type == "modified") {
              //     const newChat = change.doc.data();
              //     console.log("New Chat Data", newChat)
              //     const chatId = change.doc.id;
              //     if (newChat.admin_unreads != 0) {
              //       addNotification(newChat, chatId);
              //     }
              //   }
                
              // })
              if (!querySnapshot.empty) {


                console.log(querySnapshot.docs.length,"Order Notification Data issss")
                const latestOrderDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                console.log(latestOrderDoc, "Latest Order Document");
                // initialDataHandler("realtime");
                const data = latestOrderDoc.data();

                const chatId = latestOrderDoc.id;

                const newChat = {
                  chat_avatar: "", // default or pull from another collection if available
                  chat_name: `New Order #${data.order_id}`, // make it descriptive
                  last_message: {
                    name: "System",
                    value: `You have a new order with ID ${data.order_id}`
                  }
                };
                setOrderNotification(true)
                addNotification(newChat, chatId);
    
    
              } else {
                console.log("No orders found.");
              }
    
            },
            (error) => {
              console.error("Error fetching real-time data: ", error);
            }
          );
    
          return () => unsubscribe();
  };

  return (
    <CurrencyContext.Provider value={{ currencyData, setCurrencyData }}>
      <UserLoginContext.Provider value={{ userLogin, setUserLogin, userData, setUserData }}>
        {/* ✅ Toast Container for chat notification and others */}
      <ToastContainer position="bottom-right" />
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
                    <Route exact path="/forgetpassword" name="Forget Password Page" element={<ForgetPassword />} errorElement={<Page404></Page404>} />
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
