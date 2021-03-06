import { observable, action, computed } from 'mobx';

import { firebase, auth } from 'libs';

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

    constructor() {
        this.uiConfig = {
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
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
            firebaseUser.getIdToken().then((idToken)=> {
                const payload = JSON.parse(base64.decode(idToken.split('.')[1]));
                this.isAdmin = payload['admin'] || false;
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
        console.log('setNewUser', newUser);
        this.newUser = newUser;
    }

    //#endregion
}

export default new AuthStore();