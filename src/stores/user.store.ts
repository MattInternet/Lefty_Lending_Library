import {
    pubsub,
    USER_AUTHENTICATED,
} from 'pubsub';

import {User} from 'data/models/User'
import { computed, observable } from 'mobx';
import { client } from 'data';

export class UserStore {

    /**
     * Gets whether the user prefers light or dark theme (dark is default)
     */
    @computed
    public get userTheme() : 'dark'|'light'{
        //Get from userProfile if possible, else get from localStorage, else default to dark
        if(this.userProfile){
            return this.userProfile.Theme;
        }
        let localTheme = localStorage.getItem('Theme');
        if(localTheme === 'dark' || localTheme === 'light'){
            return localTheme;
        }
        return 'dark';
    }

    @observable
    public userProfile: User | null;

    /**
     * Gets whether the user is logged in or not
     */
    @computed
    public get isLoggedIn() : boolean{
        return this.userProfile !== null;
    }

    public setUserTheme = async (theme: 'dark'|'light') => {
        if(this.userProfile){
            this.userProfile.Theme = theme;
            localStorage.setItem('Theme', theme);
            client.users.setUserTheme(this.userProfile.uid, theme);
        }
        else{
            console.error('Attempted to setUserTheme without a logged in user');
        }
    }

    constructor() {
        pubsub.subscribe(USER_AUTHENTICATED, this.onUserAuthenticated);
    }

    onUserAuthenticated = async(USER_AUTHENTICATED: string, user: User|null) => {
        this.userProfile = user;
        if(user){
            this.syncUserLocalData(user);
        }
    }

    private syncUserLocalData(user: User){
        localStorage.setItem('Theme', user.Theme);
    }
}

export default new UserStore();