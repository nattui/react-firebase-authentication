import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAo3mboiCWCcu-jB2NTsQjUOHitmb7Y2sc',
  authDomain: 'authentication-example-8543f.firebaseapp.com',
  projectId: 'authentication-example-8543f',
  storageBucket: 'authentication-example-8543f.appspot.com',
  messagingSenderId: '114873983237',
  appId: '1:114873983237:web:729f780cc84c8226d8576c'
};

firebase.initializeApp(firebaseConfig);

export default firebase;
export const auth = firebase.auth();
