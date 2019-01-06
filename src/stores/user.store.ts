import {
    pubsub,
    USER_AUTHENTICATED,
} from 'pubsub';

import {User} from 'data/models/User'
import { computed, observable } from 'mobx';

export class UserStore {

    /**
     * Gets whether the user prefers light or dark theme (dark is default)
     */
    @computed
    public get userTheme() : 'dark'|'light'{
        return 'light';
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

    

    constructor() {
        pubsub.subscribe(USER_AUTHENTICATED, this.onUserAuthenticated);
    }

    onUserAuthenticated = async(USER_AUTHENTICATED: string, user: User|null) => {
        this.userProfile = user;
        console.log('onUserAuthenticated', this.userProfile);
    }
}

export default new UserStore();