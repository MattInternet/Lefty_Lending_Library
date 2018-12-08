import * as firebase from 'firebase';

import { authConfig } from 'config';

firebase.initializeApp(authConfig);

const auth = firebase.auth();
const storage = firebase.storage();

export {
    firebase,
    auth,
    storage,
};