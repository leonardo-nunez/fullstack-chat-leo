import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyDV0wo_oS5Dy21xNsmen9mfSET8vX7P83c',
  authDomain: 'fullstack-chat-leo.firebaseapp.com',
  projectId: 'fullstack-chat-leo',
  storageBucket: 'fullstack-chat-leo.appspot.com',
  messagingSenderId: '817852232448',
  appId: '1:817852232448:web:63eb96740c0e18e64939e5',
  measurementId: 'G-H8HEDLB42D',
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(auth);
