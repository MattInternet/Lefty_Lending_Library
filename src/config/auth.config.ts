let isProduction = false; //TODO: Find a way to set this accordingly

let config = {};
if (isProduction) {
    throw new Error('No production auth config setup!');
} else {
    config = {
        apiKey: "AIzaSyAwA1MMLiWA19hmOwNOyAtmG2lW_Uuh3gc",
        authDomain: "leftylendinglibrary-c85d7.firebaseapp.com",
        databaseURL: "https://leftylendinglibrary-c85d7.firebaseio.com",
        projectId: "leftylendinglibrary-c85d7",
        storageBucket: "leftylendinglibrary-c85d7.appspot.com",
        messagingSenderId: "977740674552"
    }
}

export const authConfig = config;