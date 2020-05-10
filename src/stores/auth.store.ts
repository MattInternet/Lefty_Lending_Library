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
    
    // private httpsCallable = async (type: string) => {
    //   const callable = await functions.httpsCallable(type);
    //   return callable;
    // } 
    
    
    private determineAdminStatus = async (firebaseUser: firebase.User | null) => {
        if(firebaseUser){
            firebaseUser.getIdToken().then(async(idToken)=> {
                const payload = await JSON.parse(base64.decode(idToken.split('.')[1]));
                this.isAdmin = payload['admin'] || false;
                
                const appurl = 
                process.env.REACT_APP_TEST_ENV ? 
                'https://us-central1-leftylendinglibrary-test.cloudfunctions.net' : 
                (process.env.REACT_APP_BUILD_ENV === 'development' ? 
                'http://localhost:5000' : 
                 'https://us-central1-leftylendinglibrary.cloudfunctions.net');
                    // process.env.REACT_APP_BUILD_ENV === 'development' ?
                    // 'http://localhost:5000'
                    // 'http://localhost:5002/leftylendinglibrary/us-central1'
                    // : 
                    // "https://leftylendinglibrary.web.app"
                    // 'https://us-central1-leftylendinglibrary.cloudfunctions.net/leftylendinglibrary/us-central1'
                if (!!this.isAdmin) {
                    const authGoogleUrl = `${appurl}/authgoogleapi`;
                    // const googleSheetUrl = `${appurl}/getgooglesheet/${encodeURIComponent(this.uiConfig.signInOptions[1].spreadsheetId)}`;
                    const response: any =  await fetch(authGoogleUrl, {mode:'no-cors'});
                    // console.log(response)
                    const reader: any = response.body.getReader();
                    let charsReceived: number = 0;
                    
                    // read() returns a promise that resolves
                    // when a value has been received
                    const list2 = document.createElement('ul');
                    let result: string = '';
                    await reader.read().then(function processText({ done, value }) {
                        // Result objects contain two properties:
                        // done  - true if the stream has already given you all its data.
                        // value - some data. Always undefined when done is true.
                        if (done) {
                          console.log("Stream complete");
                    
                          // para.textContent = value;
                          return;
                        }
                    
                        // value for fetch streams is a Uint8Array
                        charsReceived += value.length;
                        const chunk = value;
                        let listItem = document.createElement('li');
                        listItem.textContent = 'Received ' + charsReceived + ' characters so far. Current chunk = ' + chunk;
                        list2.appendChild(listItem);
                    
                        result += chunk;
                    
                        // Read some more, and call this function again
                        reader.read().then(processText);
                        return 
                            // console.log(response.body)
                            // const body: any = await response.json();
                            // if (response.status !== 200) throw Error(body.message);
                            // console.log(body);
                              // .then(async(dat: any) => {
                              //     const data = await JSON.stringify(dat);
                              //     console.log(data)
                              // }
                              // 
                              // )
                              // .catch(err => console.log(err));
                              // console.log(res);
                              // const sh: any = await /*request*/fetch(googleSheetUrl
                              //     // {
                              //     // url: googleSheetUrl
                              //     // }
                              // , {method: 'POST',mode:'no-cors'})
                              // .then(async(result: any)=> await result
                              // // {
                              // //     console.log(result)
                              // 
                              // // 
                              // // }
                              // )
                              // .then((result: any) => result)
                              // .catch(err => console.log(err))
                              // if (!!sh) {
                    
                              // await data.values
                              // .forEach(async (row: any, i: number) => {
                              //      const newRow: any = {};
                              //      const keys = [
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
                      });
                      console.log(result)
                    //   console.log(result.toString())
                      // } else {
                      //     console.log('couldnt get data')
                      // }
                      // {
                      // 
                      // }
                      this.isAdmin = true;

                }
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