import { auth } from "../services/firebaseConnect";
import { signInWithEmailAndPassword, signOut as fbSignOut } from "firebase/auth";

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return await fbSignOut(auth);
}
