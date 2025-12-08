
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC5mLwcyfMJ4mbXtPj92ykaJF8PIyQlxQo",
  authDomain: "dbcortes.firebaseapp.com",
  projectId: "dbcortes",
  storageBucket: "dbcortes.firebasestorage.app",
  messagingSenderId: "876211551124",
  appId: "1:876211551124:web:d8aebe0690d5ccd1342d81",
  measurementId: "G-15V6TGSQWZ"
};



// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 
const analytics = getAnalytics(app);


export { auth, db, analytics };