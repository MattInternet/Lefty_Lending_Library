import * as firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/functions';
// import * as admin from 'firebase-admin';

import { authConfig } from '../config';

firebase.initializeApp(authConfig);

const auth = firebase.auth();
const storage = firebase.firestore();
const functions = firebase.functions();

export {
    firebase,
    auth,
    storage,
    functions,
    // admin
};