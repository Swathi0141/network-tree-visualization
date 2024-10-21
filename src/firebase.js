import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDAKh5TERFzi7hVD7GfyOGpjqjvxY3ZEu8",
  authDomain: "network-tree-b5adc.firebaseapp.com",
  projectId: "network-tree-b5adc",
  storageBucket: "network-tree-b5adc.appspot.com",
  messagingSenderId: "643152985691",
  appId: "1:643152985691:web:323ea094ad997ad975c97e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);