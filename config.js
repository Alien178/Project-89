import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyAykG2m-ubSMVwWaOXpp-v26D-uX4q-5nc",
  authDomain: "barterapp-8056f.firebaseapp.com",
  projectId: "barterapp-8056f",
  storageBucket: "barterapp-8056f.appspot.com",
  messagingSenderId: "666396582501",
  appId: "1:666396582501:web:699dd70c5affc845931c8c",
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
