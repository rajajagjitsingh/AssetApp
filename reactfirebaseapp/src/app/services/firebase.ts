// Import the functions you need from the Firebase SDKs
// TODO: Add SDKs for Firebase products that you want to use
// You can find available libraries at https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Import your Firebase configuration from an external file
import { firebaseConfig } from "./../../../firebaseConfig";

// Initialize the Firebase app using the provided configuration
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// Export the initialized Firebase app
export default app;

// Export references to the Firebase authentication and Firestore database
export const auth = firebase.auth();
export const database = firebase.firestore();

// Define the name of the Firestore collection where assets are stored
export const databseCollectionName = "assets";
