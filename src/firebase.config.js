// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";

export function getFirebaseConfig() {
    if (!firebaseConfig || !firebaseConfig.apiKey) {
        throw new Error('No Firebase configuration object provided.' + '\n' +
        'Add your web app\'s configuration object to firebase-config.js');
    } else {
        return firebaseConfig;
    }
}
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-6XuGH9tyPGbtK79z6x5jVZp2gJMDMhM",
    authDomain: "task-app-cfc1e.firebaseapp.com",
    projectId: "task-app-cfc1e",
    storageBucket: "task-app-cfc1e.appspot.com",
    messagingSenderId: "616213062975",
    appId: "1:616213062975:web:025ae30933125483ea5f8a"
};

// Initialize Firebase
const firebaseAppConfig = getFirebaseConfig();
// Initialize Firebase
initializeApp(firebaseAppConfig);
