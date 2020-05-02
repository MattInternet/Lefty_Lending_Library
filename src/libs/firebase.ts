import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

import { authConfig } from 'config';

firebase.initializeApp(authConfig);

const auth = firebase.auth();
const storage = firebase.firestore();

export {
    firebase,
    auth,
    storage,
};