// const admin = require('firebase-admin');
let buildType = process.env.REACT_APP_BUILD_ENV; //TODO: Find a way to set this accordingly

let config: any;
console.log(`Build type: ${buildType}`);
if (buildType === "production") {
    throw new Error('No production auth config setup!');
}
else if(buildType === "staging"){
    config = {
        apiKey: "AIzaSyDqv2ZTLI6GedIqIXfgjHtdAY7AzZ_Rt-o",
        authDomain: "leftylendinglibrary-staging.firebaseapp.com",
        databaseURL: "https://leftylendinglibrary-staging.firebaseio.com",
        projectId: "leftylendinglibrary-staging",
        storageBucket: "leftylendinglibrary-staging.appspot.com",
        messagingSenderId: "846787073683"
    }
}
//Dev
else {
    const firebaseConfig = require('../firebasesecrets/leftylendinglibrary_firebaseConfig.json')
    config = firebaseConfig
}

export const authConfig = config;