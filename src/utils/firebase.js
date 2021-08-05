import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({ apiKey: 'AIzaSyASl9D1nIQwG2jRodZs63ky21HmaSGt7Kg' });

export const auth = firebase.auth();
