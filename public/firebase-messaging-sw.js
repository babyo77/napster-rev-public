importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC3UYt7dxYgR-8T1DgdZT86pwi5JmKLF2Y",
  authDomain: "ngl-drx-prod.firebaseapp.com",
  projectId: "ngl-drx-prod",
  storageBucket: "ngl-drx-prod.appspot.com",
  messagingSenderId: "162610520917",
  appId: "1:162610520917:web:e039ca4f4c659eeafa05dc",
  measurementId: "G-C7VFF3RJ2P",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = "You have a new Tune Ready to Listen?";
  const notificationOptions = {
    body: "",
    icon: "https://napster-drx.vercel.app/newfavicon.jpg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
