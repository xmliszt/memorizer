# memorizer
Use Ebbinghaus forgotten equation to auto plan out your revision pattern. Developed in Vue.js

## Firebase Configuration
Please add your own firebase configuration file under `memorizer/` following the template below:

`memorizer/firebase.js`
```:js
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';

# Fill up this part
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};


export const app = firebase.initializeApp(firebaseConfig);


app.auth().onAuthStateChanged(function(user) {
  if (user) {
    sessionStorage.setItem('user', user.uid);
  }
});

export const db = app.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();
```