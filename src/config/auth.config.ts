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
  // const serviceAccount = require('../firebasesecrets/leftylendinglibrary-ba29c77d2494.json')
  // config = { 
  //   databaseURL: "https://leftylendinglibrary.firebaseio.com",
  //   credential:  admin.credential.cert(serviceAccount)
  // }//JSON.parse(process.env.FIREBASE_CONFIG);
  // console.log(adminConfig);
  // adminConfig.credential = admin.credential.cert(serviceAccount);
  const firebaseConfig = require('../firebasesecrets/leftylendinglibrary_firebaseConfig.json')
    config = firebaseConfig
    
    //adminConfig//
    // JSON.parse(JSON.stringify(firebaseConfig));
    // {
    //     apiKey: "AIzaSyAwA1MMLiWA19hmOwNOyAtmG2lW_Uuh3gc",
    //     authDomain: "leftylendinglibrary-c85d7.firebaseapp.com",
    //     databaseURL: "https://leftylendinglibrary-c85d7.firebaseio.com",
    //     projectId: "leftylendinglibrary-c85d7",
    //     storageBucket: "leftylendinglibrary-c85d7.appspot.com",
    //     messagingSenderId: "977740674552"
    // }
}

export const authConfig = config;