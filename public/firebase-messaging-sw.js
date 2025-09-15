importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBbvlNh0zpmV28Rm-6_eHDVZn1z1b6AYJk",
  authDomain: "aahaas-bb222.firebaseapp.com",
  databaseURL: "https://aahaas-bb222.firebaseio.com",
  projectId: "aahaas-bb222",
  storageBucket: "aahaas-bb222.appspot.com",
  messagingSenderId: "410570906249",
  appId: "1:410570906249:web:7011de846e1545b41fc458",
  measurementId: "G-NBE9YJNDGZ"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/icon-192x192.png',
    data: payload.data // Pass through navigation data
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Handle navigation if data is available
  if (event.notification.data && event.notification.data.navigation) {
    const navigation = event.notification.data.navigation;
    // You can handle deep linking here
    event.waitUntil(
      clients.openWindow(navigation.params.redirectLink || '/')
    );
  }
});