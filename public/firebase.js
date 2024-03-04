import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
//import { initializeApp } from "firebase/app"


const firebaseConfig = {
    apiKey: "AIzaSyD6kMvvJNgVDsJTosdN3c_4dOYWfCac5hU",
    authDomain: "fileup-ca60c.firebaseapp.com",
    projectId: "fileup-ca60c",
    storageBucket: "fileup-ca60c.appspot.com",
    messagingSenderId: "777973548707",
    appId: "1:777973548707:web:e99b06a451180058652116"
};

firebase.initializeApp(firebaseConfig);

export function gog() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(this.remember.checked ? fireauth.Auth.Persistence.LOCAL : fireauth.Auth.Persistence.SESSION)
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log(`Hello ${user.displayName}`);
        })
}


/*
import { getAuth, setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();

export function gog(){
setPersistence(auth, inMemoryPersistence)
    .then(() => {
        const provider = new GoogleAuthProvider();
        // In memory persistence will be applied to the signed in Google user
        // even though the persistence was set to 'none' and a page redirect
        // occurred.
        return signInWithRedirect(auth, provider);
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });}*/