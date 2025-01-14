// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpoQyEP3TNozNlvf7hX6s7AzBJMnRBIpE",
  authDomain: "edupyapp-pawm.firebaseapp.com",
  projectId: "edupyapp-pawm",
  storageBucket: "edupyapp-pawm.firebasestorage.app",
  messagingSenderId: "877863675387",
  appId: "1:877863675387:web:677db58705095991ef975e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(app);
export const firestore = getFirestore(app);