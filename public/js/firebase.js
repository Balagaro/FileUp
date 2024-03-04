import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
//import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyAhowMPtB3KgmajGNl1SL0lKMvU5Ywdv4Y",
    authDomain: "fileup-41fd2.firebaseapp.com",
    projectId: "fileup-41fd2",
    storageBucket: "fileup-41fd2.appspot.com",
    messagingSenderId: "333356871666",
    appId: "1:333356871666:web:5dbd5f3aa62e2c3011456b",
    measurementId: "G-F69VGYLKBE"
};

firebase.initializeApp(firebaseConfig);

export function gog(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(this.remember.checked ? fireauth.Auth.Persistence.LOCAL : fireauth.Auth.Persistence.SESSION)
    firebase.auth().signInWithPopup(provider)
        .then(result =>{
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