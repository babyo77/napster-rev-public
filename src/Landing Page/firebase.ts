import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { Messaging, getMessaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyC3UYt7dxYgR-8T1DgdZT86pwi5JmKLF2Y",
  authDomain: "ngl-drx-prod.firebaseapp.com",
  projectId: "ngl-drx-prod",
  storageBucket: "ngl-drx-prod.appspot.com",
  messagingSenderId: "162610520917",
  appId: "1:162610520917:web:e039ca4f4c659eeafa05dc",
  measurementId: "G-C7VFF3RJ2P",
};
let messaging: Messaging | null = null;

const app = initializeApp(firebaseConfig);
if ("serviceWorker" in navigator) {
  messaging = getMessaging(app);
} else {
  console.error("Service workers are not supported in this environment.");
}

export { messaging };
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export default app;
