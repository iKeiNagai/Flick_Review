
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: process.env.PRIVATE_FIREBASE_API_KEY,
  authDomain: process.env.PRIVATE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PRIVATE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PRIVATE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PRIVATE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PRIVATE_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);


export default app;
