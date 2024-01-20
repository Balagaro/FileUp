import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";


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
    firebase.auth().signInWithPopup(provider)
        .then(result =>{
            const user = result.user;
            console.log(`Hello ${user.displayName}`);
            console.log(user)
        })
}