/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Sample trigger function that copies new Firebase data to a Google Sheet
// const Logging: any = require('@google-cloud/logging');
import * as cors from 'cors';
// import { promisify } from 'util';
const express = require('express');
// const cors = require('cors')({origin:true});
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');

const DB_TOKEN_PATH = '/api_tokens';
// TODO: Use firebase functions:config:set to configure your googleapi object:
// googleapi.client_id = Google API client ID,
// googleapi.client_secret = client secret, and
// googleapi.sheet_id = Google Sheet id (long string in middle of sheet URL)
const CONFIG_CLIENT_ID = functions.config().googleapi.client_id;
const CONFIG_CLIENT_SECRET = functions.config().googleapi.client_secret;
const CONFIG_SHEET_ID = functions.config().googleapi.sheet_id;

// TODO: Use firebase functions:config:set to configure your watchedpaths object:
// watchedpaths.data_path = Firebase path for data to be synced to Google Sheet
// const CONFIG_DATA_PATH = functions.config().watchedpaths.data_path;

// The OAuth Callback Redirect.
const FUNCTIONS_REDIRECT = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/oauthcallback`;

// setup for authGoogleAPI
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',"email","openid",
  "https://www.googleapis.com/auth/cloudplatformprojects.readonly","https://www.googleapis.com/auth/firebase","https://www.googleapis.com/auth/cloud-platform"
];
const functionsOauthClient = new OAuth2Client(CONFIG_CLIENT_ID, CONFIG_CLIENT_SECRET,
  FUNCTIONS_REDIRECT);

const appurl = 
  process.env.REACT_APP_TEST_ENV ? 
  'https://leftylendinglibrary-test.web.app' : 
  (process.env.REACT_APP_BUILD_ENV === 'development' ? 
  'http://localhost:5002' : 
  'https://leftylendinglibrary.web.app');
const googleOAuth = express();
const corsHandler = cors({origin: appurl});

// Automatically allow cross-origin requests
googleOAuth.use(corsHandler);

googleOAuth.use((req: any, res: any) => {
    res.set('Cache-Control', 'public, max-age=0, s-maxage=0');
    res.set('Access-Control-Allow-Methods', 'GET, POST')
});

googleOAuth.get('/authgoogleapi', (req: any, res: any) => {
    res.set('Cache-Control', 'public, max-age=0, s-maxage=0');
    res.redirect(functionsOauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    }));
});
googleOAuth.get('/oauthcallback', async (req: any, res: any) => {
    res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
    const code = req.query.code;
    return res.status(200).send(code)
    //res.redirect(`/getgooglesheet/${code}`)
});

function getData() {
    return new Promise(async(resolve, reject) => {
        const sheets: any = google.sheets(
            // 'v4'
            {
            auth: functionsOauthClient,
            version: 'v4'
            }
        );
        sheets.spreadsheets.values
        .get({
            spreadsheetId: CONFIG_SHEET_ID,//authConfig.spreadsheetId,
            range: "Books"
        })
        .then(async (result: any) => {
            // let hr: string[] = [];
            if (!!result) {
                resolve(result)
                // return res.status(200).send(result)
            }
        })
        .catch((err: any) =>{
            reject(err)
            // return res.status(400).send('couldnt connect');
        });
        // try {
        //   const response = (await sheets.spreadsheets.values
        //   .get({
        //       spreadsheetId: CONFIG_SHEET_ID,//authConfig.spreadsheetId,
        //       range: "Books",
        //       auth: functionsOauthClient,
        //   })).data;
        //   // console.log(JSON.stringify(response, null, 2));
        //   resolve(JSON.stringify(response))
        // } catch(err) {
        //   reject(err)
        // }
    })
}

googleOAuth.get('/getgooglesheet/:code', async(req: any, res: any, next: any) => {
    const code: string = req.params.code;
    const {tokens} = await functionsOauthClient.getToken(code);
    functionsOauthClient.setCredentials({refresh_token: tokens.refresh_token, access_token: tokens.access_token});
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    await admin.database().ref(DB_TOKEN_PATH).set(tokens);
    google.options({
        auth: functionsOauthClient
    })
    const data: any = await getData().then((responses: any) => responses)
    .catch((err:any)=>next(err));
    return res.status(200).send(data);
})

// // trigger function to write to Sheet when new data comes in on CONFIG_DATA_PATH
// exports.appendrecordtospreadsheet = functions.database.ref(`${CONFIG_DATA_PATH}/{ITEM}`).onCreate(
//     (snap: any) => {
//       const newRecord = snap.val();
//       return appendPromise({
//         spreadsheetId: CONFIG_SHEET_ID,
//         range: 'A:C',
//         valueInputOption: 'USER_ENTERED',
//         insertDataOption: 'INSERT_ROWS',
//         resource: {
//           values: [[newRecord.firstColumn, newRecord.secondColumn, newRecord.thirdColumn]],
//         },
//       });
//     });

// accepts an append request, returns a Promise to append it, enriching it with auth
// function appendPromise(requestWithoutAuth: any) {
//   return new Promise((resolve, reject) => {
//     return getAuthorizedClient().then((client) => {
//       const sheets = google.sheets('v4');
//       const request = requestWithoutAuth;
//       request.auth = client;
//       return sheets.spreadsheets.values.append(request, (err: any, response: any) => {
//         if (err) {
//           console.log(`The API returned an error: ${err}`);
//           reject(err);
//         }
//         resolve(response.data);
//       });
//     });
//   });
// }
// 
// // checks if oauthTokens have been loaded into memory, and if not, retrieves them
// async function getAuthorizedClient() {
//   if (oauthTokens) {
//     return functionsOauthClient;
//   }
//   const snapshot = await admin.database().ref(DB_TOKEN_PATH).once('value');
//   oauthTokens = snapshot.val();
//   functionsOauthClient.setCredentials(oauthTokens);
//   return functionsOauthClient;
// }

// // HTTPS function to write new data to CONFIG_DATA_PATH, for testing
// exports.testsheetwrite = functions.https.onRequest(async (req: any, res: any) => {
//   const random1 = Math.floor(Math.random() * 100);
//   const random2 = Math.floor(Math.random() * 100);
//   const random3 = Math.floor(Math.random() * 100);
//   const ID = new Date().getUTCMilliseconds();
//   await admin.database().ref(`${CONFIG_DATA_PATH}/${ID}`).set({
//     firstColumn: random1,
//     secondColumn: random2,
//     thirdColumn: random3,
//   });
//   res.send(`Wrote ${random1}, ${random2}, ${random3} to DB, trigger should now update Sheet.`);
// });
// catch 404 and forward to error handler
googleOAuth.use(function (req: any, res: any, next: any) {
  const err = new Error('Not Found');
  next(err);
});

// error handlers
googleOAuth.use(function (err: any, req: any, res: any) {
  // const errMsg = new Error(err)
  return res.status(400).send('api not working');
});

const googleoauthcaller = functions.https.onRequest((request: any, response: any) => {
    corsHandler(request, response, () => {
        console.log(request)
    });
    if (!request.path) {
      request.url = `/${request.url}`; // Prepend '/' to keep query params if any
    }
    // response.set('Access-Control-Allow-Origin', appurl);
    return googleOAuth(request, response);
})

exports.googleoauthcaller = googleoauthcaller;