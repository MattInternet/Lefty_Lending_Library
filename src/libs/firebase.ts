import * as firebase from 'firebase';

import { authConfig } from 'config';

firebase.initializeApp(authConfig);

const auth = firebase.auth();
const storage = firebase.firestore();

export {
    firebase,
    auth,
    storage,
};