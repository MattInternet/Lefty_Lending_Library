/*
This app can be used to add/revoke admin status to a user on the LLL firebase.
ex: yarn start [dev/staging] [up/down] [xxxUserIdxxx]
*/

var admin = require('firebase-admin');




if (!process.argv[2]) {
  throw Error("Example: yarn start [dev/staging] [up/down] [xxxUserIdxxx]");
}

var serviceAccountJsonPath;
var databaseURL;

switch (process.argv[2]) {
  case 'staging':
    serviceAccountJsonPath = "./LLLStaging-serviceAccountKey.secret.json";
    databaseURL = "https://leftylendinglibrary-staging.firebaseio.com";
    break;
  default: //dev
    // serviceAccountJsonPath = "./LLL-serviceAccountKey.secret.json";
    // databaseURL = "https://leftylendinglibrary-c85d7.firebaseio.com";
    serviceAccountJsonPath = "../src/firebasesecrets/leftylendinglibrary-ba29c77d2494.json";
    databaseURL = "https://leftylendinglibrary.firebaseio.com";
}

var serviceAccount = require(serviceAccountJsonPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

if (!process.argv[3]) {
  throw Error("Example: yarn start [dev/staging] [up/down] [xxxUserIdxxx]");
}

let upgrade = process.argv[3] === "up";

if (!process.argv[4]) {
  throw Error("Example: yarn start [dev/staging] [up/down] [xxxUserIdxxx]");
}

let uid = process.argv[4];

// The new custom claims will propagate to the user's ID token the
// next time a new one is issued.
admin.auth().setCustomUserClaims(uid, { admin: upgrade }).then(()=> {
console.log()
})
admin.auth().getUser(uid)
  .then(async(userResult) => {
     // Confirm the user is an Admin.
     if (!!userResult) {
       // Show admin UI.
       console.log('user');
       console.log(userResult);
     }
   })
   .catch(err=>console.log(err))
