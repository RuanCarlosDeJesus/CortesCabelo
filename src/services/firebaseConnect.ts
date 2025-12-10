import { initializeApp, getApps } from "firebase/app";
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

// ⚠️ IMPORTANTE: Impede inicialização duplicada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
