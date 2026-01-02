// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCDQQw9AeisFt5fmx6z0bwcB1NOWei67kk",
  authDomain: "project-management-1463c.firebaseapp.com",
  projectId: "project-management-1463c",
  storageBucket: "project-management-1463c.appspot.com",
  messagingSenderId: "492979326783",
  appId: "1:492979326783:web:8677ff740c7bc231618d8a",
  measurementId: "G-Y4S2FDQLEW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);