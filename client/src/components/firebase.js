import * as firebase from 'firebase';
// import { storage } from 'firebase-admin';
import 'firebase/storage';

var firebaseConfig;
console.log(window.location.href);
if (window.location.href.includes("manifestmy.life")) {
  firebaseConfig = {
    apiKey: "AIzaSyBg2vblzyhpsM-eVsUH2Rb-5iKnMpSLcEAv",
    authDomain: "manifestmylife.firebaseapp.com",
    databaseURL: "https://manifestmylife.firebaseio.com",
    projectId: "manifestmylife",
    storageBucket: "manifestmylife.appspot.com",
    messagingSenderId: "717980399518",
    appId: "1:717980399518:web:553aadeb783bd8090d088f",
    measurementId: "G-CL3BMK155G"
  };
}
else {
  firebaseConfig = {
    /*apiKey: "AIzaSyDBgPVcjoV8LbR4hDA7tm3UoP0abMw8guE",
    authDomain: "project-caitlin-c71a9.firebaseapp.com",
    databaseURL: "https://project-caitlin-c71a9.firebaseio.com",
    projectId: "project-caitlin-c71a9",
    storageBucket: "project-caitlin-c71a9.appspot.com",
    messagingSenderId: "711685546849",
    appId: "1:711685546849:web:5c7a982748eb3bec35db20",
    measurementId: "G-DCQF4LY5ZH"*/
        
        apiKey:            "AIzaSyBjuyhZxmvzey9-hMEdIUoems6c9bEQ-nI",
		authDomain:        "myspace-db.firebaseapp.com",
		databaseURL:       "https://myspace-db.firebaseio.com",
		projectId:         "myspace-db",
		storageBucket:     "myspace-db.appspot.com",
		messagingSenderId: "287117315224",
		appId:             "1:287117315224:web:c7af6690d5e269a7ab54ed",
		measurementId:     "G-WRGR8M5LRN"
  };
}

firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
var storage = firebase.storage();
// var admin = require("firebase-admin");
// var storage = firebase.storage();

// export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
export {storage, firebase as default};
