import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDBgPVcjoV8LbR4hDA7tm3UoP0abMw8guE",
    authDomain: "project-caitlin-c71a9.firebaseapp.com",
    databaseURL: "https://project-caitlin-c71a9.firebaseio.com",
    projectId: "project-caitlin-c71a9",
    storageBucket: "project-caitlin-c71a9.appspot.com",
    messagingSenderId: "711685546849",
    appId: "1:711685546849:web:5c7a982748eb3bec35db20",
    measurementId: "G-DCQF4LY5ZH"
  };

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
