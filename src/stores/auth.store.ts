import { observable, action, computed } from 'mobx';
import fetch from 'node-fetch';
// import { request } from 'gaxios';
// import * as request from 'request-promise';
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

        this.uiConfig = {
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                {
                  provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                  scopes: authConfig.scopes,
                  discoveryDocs: authConfig.discoveryDocs,
                  spreadsheetId: authConfig.spreadsheetId
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: () => false,
            },
        };
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
    
    private determineAdminStatus = async (firebaseUser: firebase.User | null) => {
        if(firebaseUser){
          if (!!this.isAdmin) {
            firebaseUser.getIdToken().then(async(idToken)=> {
                const payload = 
                // await JSON.parse(
                base64.decode(idToken.split('.')[1])
                // );
                this.isAdmin = payload['admin'] || false;
                
                const appurl: string = 
                process.env.REACT_APP_TEST_ENV ? 
                'https://us-central1-leftylendinglibrary-test.cloudfunctions.net' : 
                (process.env.REACT_APP_BUILD_ENV === 'development' ? 
                'http://localhost:5001' : 
                'https://us-central1-leftylendinglibrary.cloudfunctions.net');
                if (!!this.isAdmin) {
                  const authGoogleUrl = `${appurl}/authgoogleapi`;
                  const response: any =  await fetch(authGoogleUrl, {mode:'no-cors'});
                  const reader: any = response.body.getReader();
                  let result: any = '';
                  await reader.read().then(function processText(done: any, value: any) {
                      // Result objects contain two properties:
                      // done  - true if the stream has already given you all its data.
                      // value - some data. Always undefined when done is true.
                      if (done) {
                        console.log("Stream complete");
                        return;
                      }
                      // value for fetch streams is a Uint8Array
                      const chunk = value;
                      result += chunk;
                      // Read some more, and call this function again
                      reader.read().then(processText);
                      return 
                  });
                  // if (result !== '') {
                    
                    // await result.data.values
                    // .map(async (row: any, i: number) => {
                    //      const newRow: any = {};
                    //      const keys: array = [
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
                    //      await row.forEach(function(c: any, j: number){
                    //         let d = c;
                    //         if (i > 2){
                    //           if (!c || c === 'undefined') {
                    //             d = null;
                    //             // nullcount++;
                    //           }
                    //           newRow[keys[j]] = d;
                    //         }
                    //       });
                    //       if (i > 2){
                    //         console.log(newRow)
                    //         // await this.handleAddBook(newRow);
                    //       } 
                    // });

                  // }
                  // result = 
                  // // JSON.stringify(
                  //   Array.from(new Int32Array(result))
                  // // );
                  let utf8decoder:any = new TextDecoder('utf8');
                  let u8arr:any = new Int8Array(result);
                  
                  console.log(utf8decoder.decode(u8arr))
                  //console.log(result.toString())
                  this.isAdmin = true;
                }
            });
          }
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