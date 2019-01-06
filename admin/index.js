var admin = require('firebase-admin');

var serviceAccount = require("./LLL-serviceAccountKey.secret.json");



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://leftylendinglibrary-c85d7.firebaseio.com"
});

if(!process.argv[2]){
  throw Error("Please provide 'up' or 'down'  (ex: yarn start up xxxUIDxxx)");
}

let upgrade = process.argv[2] === "up";

if(!process.argv[3]){
  throw Error("Please provide a uid!  (ex: yarn start up xxxUIDxxx)");
}

let uid = process.argv[3];

admin.auth().setCustomUserClaims(uid, {admin: upgrade}).then(() => {
  // The new custom claims will propagate to the user's ID token the
  // next time a new one is issued.
  });