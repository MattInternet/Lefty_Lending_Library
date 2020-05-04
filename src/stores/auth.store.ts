import { observable, action, computed } from 'mobx';
// import functions from 'firebase-functions';
// import gapi from 'gapi-client';
// import $script from 'scriptjs';
import { 
  firebase, 
  auth, 
  functions 
} from 'libs';
// import '@firebase/functions';
import { authConfig } from 'config';
// import * as serviceAccount from '../firebasesecrets/leftylendinglibrary-ba29c77d2494.json'
import client from 'data/client';
import {User} from 'data/models/User'
import { IUserCreationInfo } from 'common';
import {
    pubsub,
    USER_AUTHENTICATED,
} from 'pubsub';

import * as base64 from 'base-64';

export class AuthStore {
    /**
     * Gets the auth UI configuration.
     */
    public uiConfig: any;

    public readonly maxDisplayNameLength = 50;

    /**
     * Gets whether auth store is initializing.
     */
    @observable
    public initializing: boolean = true;

    /**
     * Gets whether auth store is syncing with API.
     */
    @observable
    public syncing: boolean = false;

    /**
     * Gets whether this is a new user sign up.
     */
    @observable
    public newUser: boolean = false;

    /**
     * Gets the user's profile.
     */
    @observable
    public firebaseUser: firebase.User | null;

    /**
     * Gets whether to display the login.
     */
    @observable
    public displayLogin: boolean = false;

    /**
     * Gets whether the current user is an Admin or not
     */
    @observable
    public isAdmin: boolean = false;

    /**
     * Gets whether the user is logged in or not
     */
    @computed
    public get isAuthenticated() : boolean{
        return this.firebaseUser !== null;
    }

    public functions: any = functions;
    
    constructor() {
      console.log(authConfig.scopes)
        this.uiConfig = {
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                {
                  provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                  scopes: authConfig.scopes,
                  discoveryDocs: authConfig.discoveryDocs
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: () => false,
            },
        };
        // this.googleAuthConfig = {
        //     apiKey: authConfig.apiKey,
        //     clientId: authConfig.clientId,
        //     scopes: authConfig.scopes
        // }
        auth.onAuthStateChanged(this.onAuthChanged);
    }

    //#region Public

    /**
     * Toggles the displayLogin property.
     */
    public toggleDisplayLogin = () => {
        this.setDisplayLogin(!this.displayLogin);
    }

    /**
     * Sets the displayLogin to true.
     */
    public login = () => {
        this.setDisplayLogin(true);
    }

    /**
     * Logs user out of session.
     */
    public logout = () => {
        auth.signOut();
        this.setDisplayLogin(false);
    }

    public onFinalizeUserCreation = async (userCreationInfo: IUserCreationInfo) => {
        let backendUser = await this.createBackendUser(userCreationInfo);
        this.setNewUser(false);
        this.setUserProfile(backendUser);
        
        this.setInitializing(false);
    }

    //#endregion

    //#region Private

    //This method needs work, but this works for now! :)
    private onAuthChanged = async (firebaseUser: firebase.User) => {
        this.setFirebaseUser(firebaseUser);

        if(firebaseUser == null){
            this.setUserProfile(null);
            if(this.initializing) {
                this.setInitializing(false);
            }
            return;
        }
        
        let backendUser = await this.getExistingUser(firebaseUser.uid);
        if(backendUser !== null){
            this.setUserProfile(backendUser);
            this.setInitializing(false);
            return;
        }

        this.setNewUser(true);
    }

    private async createBackendUser(userCreationInfo: IUserCreationInfo): Promise<User>{
        if(this.firebaseUser === null){
            throw new Error('FirebaseUser required...')
        }
        let backendUser = User.initializeBackendUserFromFirebaseUser(this.firebaseUser);
        backendUser.DisplayName = userCreationInfo.preferredName;
        backendUser.Phone = userCreationInfo.phone;
        backendUser.Location = userCreationInfo.location;
        await client.users.createUser(backendUser);
        return backendUser;
    }

    private getExistingUser = async (userId: string) => {
        try {
            const existingUser = await client.users.getMe(userId);
            return existingUser;
        } catch (error) {
            console.log('Failed to getExistingUser', error);
            return null;
        }
    }
    
    private httpsCallable = async (type: string) => {
      const callable = await functions.httpsCallable(type);
      return callable;
    } 
    
    // private syncGoogleSheet = async () => {
    //   const getGoogleSheet = await firebase.functions.httpsCallable('authgoogleapi');
    //   getGoogleSheet({sheetId: authConfig.spreadsheetId}).then(async result => {
    //     await result.data.values
    //     .map(async (row, i) => {
    //       // Author(s) (or Editor(s) If There Is No Author)	
    //       // Book Title	
    //       // Editor(s) and/or Translator(s) (If Author Given)	
    //       // Edition	
    //       // Keywords	
    //       // Physical Copy?	
    //       // PDF Copy?	
    //       // Free Online URL	
    //       // # of copies	
    //       // Lender	
    //       // Borrower	
    //       // Check Out Date	
    //       // Return Date	
    //       // Underlining Permitted?	
    //       // Notes	
    //       // ISBN (No Spaces/Dashes)																				
    // 
    //      let newRow: any = {};
    //      let keys = [
    //        'author',
    //        'title',
    //        'editor',
    //        'edition',
    //        'keywords',
    //        'physical',
    //        'pdf',
    //        'url',
    //        'copies',
    //        'lender',
    //        'borrower',
    //        'checkout',
    //        'return',
    //        'underlining',
    //        'notes',
    //        'isbn',
    //      ]
    //       // let nullcount = 0;
    //       await row.forEach(function(c, j){
    //         // const authorKey = /author\(s\)/gi.test(c);
    //         // const titleKey = /title/gi.test(c);
    //         // const editorKey = /translator\(s\)/gi.test(c);
    //         // const editionKey = /edition/gi.test(c);
    //         // const keywordsKey = /keywords/gi.test(c);
    //         // const physicalCopyKey = /physical\scopy/gi.test(c);
    //         // const pdfCopyKey = /pdf\scopy/gi.test(c);
    //         // const freeOnlineKey = /free\sonline/gi.test(c);
    //         // const copiesKey = /of\scopies/gi.test(c);
    //         // const lenderKey = /lender/gi.test(c);
    //         // const borrowerKey = /borrower/gi.test(c);
    //         // const checkoutKey = /check\sout/gi.test(c);
    //         // const returnKey = /return\sdate/gi.test(c);
    //         // const underliningPermittedKey = /underlining\spermitted/gi.test(c);
    //         // const notesKey = /notes/gi.test(c);
    //         // const isbnKey = /isbn/gi.test(c);
    //         if (i === 2) {
    //           hr.push(c)
    //         } else if (i > 2){
    //           if (!c || c === 'undefined') {
    //             c = null;
    //             // nullcount++;
    //           }
    //           newRow[keys[j]] = c;
    //         }
    //       });
    //       if (i > 2){
    //         console.log(newRow)
    //         // await this.handleAddBook(newRow);
    //       } 
    //     });
    // 
    //   })
    // }
    
    // async () => {
    //   console.log('k')
    //   var script = document.createElement("script");
    //   script.type = "text/javascript";
    //   script.src = "https://apis.google.com/js/api.js";
    //   // Once the Google API Client is loaded, you can run your code
    //   script.onload = function(e) {
    //     gapi.load('client:auth2', ()=> {
    //       gapi.client.init(authConfig)
    //       .then(function() {
    //           // Make sure the Google API Client is properly signed in
    //           if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    //             console.log('ok')
    //           } else {
    //             // firebase.auth().signOut(); // Something went wrong, sign out
    //           }
    //         });;
    //     })
    //   }

      // return functions.https.onRequest(async (req, res) => {
      //   const header = req.get('Authorization');
      //   let match: any = null;
      //   if (header) {
      //       match = header.match(/^Bearer\s+([^\s]+)$/);
      //       const authClient = new google.auth.OAuth2();
      //       await authClient.setCredentials({access_token: match});
      //       const sheets = await google.sheets({
      //         version: 'v4',
      //         auth: authClient//process.env.REACT_APP_GOOGLE_KEY
      //       })
      //       console.log(sheets)
      //       await sheets.spreadsheets.values
      //       .get({
      //         spreadsheetId: authConfig.spreadsheetId,
      //         range: "Books"
      //       })
      //       .then(async (result) => {
      //         // let hr: string[] = [];
      //         if (!!result) {
      //           console.log(result)
      //         }
              

      // 
      //       })
      //       .catch(err=>console.log(err));
      //   }
      // })
    // }
    
    private determineAdminStatus = async (firebaseUser: firebase.User | null) => {
        if(firebaseUser){
            firebaseUser.getIdToken().then(async(idToken)=> {
                const payload = await JSON.parse(base64.decode(idToken.split('.')[1]));
                // console.log(payload)
                // const oauth2Client = await new google.auth.OAuth2(
                //   process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID,
                //   process.env.REACT_APP_GOOGLE_OAUTH_SECRET,
                //   process.env.REACT_APP_GOOGLE_CALLBACK_URL_DEV
                // );
                // const header = req.get('Authorization');
                // if (header) {
                //     var match = header.match(/^Bearer\s+([^\s]+)$/);
                //     if (match) {
                //         return match[1];
                //     }
                // }
                // const authresult = await oauth2Client.setCredentials(payload);
                // const jwtAuth = await new google.auth.JWT(
                //   serviceAccount.client_email, 
                //   null,
                //   serviceAccount.private_key,
                //   authConfig.scopes 
                // )
                


                this.isAdmin = payload['admin'] || false;
                // this.syncGoogleSheet()
                // try {
                //   this.authGoogleAPI().then(async (result: any) => {
                //     console.log(result)
                //   })
                // } catch(err) {
                //   console.log(err)
                // }
                
                
                // let func = this.functions.httpsCallable('authgoogleapi');
                this.httpsCallable('authgoogleapi').then(result => console.log(result))
                .catch(err => console.log(err))
                
            });
        }
        this.isAdmin = false;
        
    }

    //#endregion

    //#region Actions

    @action
    private setUserProfile = (userProfile: User | null) => {
        pubsub.publish(USER_AUTHENTICATED, userProfile);
    }

    @action
    private setFirebaseUser = (firebaseUser: firebase.User | null) => {
        this.firebaseUser = firebaseUser;
        this.determineAdminStatus(this.firebaseUser);
    }

    @action
    private setDisplayLogin = (displayLogin: boolean) => {
        this.displayLogin = displayLogin;
    }

    @action
    private setInitializing = (initializing: boolean) => {
        this.initializing = initializing;
    }

    @action
    private setNewUser = (newUser: boolean) => {
        this.newUser = newUser;
    }

    //#endregion
}

export default new AuthStore();