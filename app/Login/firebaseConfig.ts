import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {getFunctions} from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCc9PzHXEzwRsw-wQUyLJzVk7f_igVc7I0",
  authDomain: "nguyen-mobile.firebaseapp.com",
  projectId: "nguyen-mobile",
  storageBucket: "nguyen-mobile.firebasestorage.app",
  messagingSenderId: "371845429798",
  appId: "1:371845429798:web:e3e7be14bec11f374684e7",
  measurementId: "G-ZFHL4F573R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app); 
export const functions = getFunctions(app);

export { auth };
