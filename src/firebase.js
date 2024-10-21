import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAKh5TERFzi7hVD7GfyOGpjqjvxY3ZEu8",
  authDomain: "network-tree-b5adc.firebaseapp.com",
  projectId: "network-tree-b5adc",
  storageBucket: "network-tree-b5adc.appspot.com",
  messagingSenderId: "643152985691",
  appId: "1:643152985691:web:323ea094ad997ad975c97e",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();