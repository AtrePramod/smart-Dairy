// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAQJP1Njxwm6Ztj1KjZwJqAyV9MV_hojq8",
  authDomain: "smartdairy-flash-notifi.firebaseapp.com",
  projectId: "smartdairy-flash-notifi",
  storageBucket: "smartdairy-flash-notifi.appspot.com",
  messagingSenderId: "558719173258",
  appId: "1:558719173258:web:b14ac07f75d83ac1d9a373",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
