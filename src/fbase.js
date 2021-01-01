import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(firebaseConfig);

// 파이어베이스의 모든 기능을 export 하기보다 사용하고 싶은 것을 export하여 사용한다.
export const authService = firebase.auth();
export const dbService = firebase.firestore();

export const firebaseInstance = firebase;
