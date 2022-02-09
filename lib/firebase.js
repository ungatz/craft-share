import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDn7H5T4y5UGNob90B3k5EnQZiaqPGMtTU",
  authDomain: "craft-share-1288c.firebaseapp.com",
  projectId: "craft-share-1288c",
  storageBucket: "craft-share-1288c.appspot.com",
  messagingSenderId: "960895737878",
  appId: "1:960895737878:web:e003d00478721bd0a6d537",
  measurementId: "G-0R8HZCSTD4"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

// Helper functions
export async function getUserFromUsername(username){
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
