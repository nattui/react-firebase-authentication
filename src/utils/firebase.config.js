import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({ apiKey: 'AIzaSyAo3mboiCWCcu-jB2NTsQjUOHitmb7Y2sc' });

export const auth = firebase.auth();
