import {jsonObject, jsonMember} from 'typedjson'
import { UserLocation } from 'data/enums';
import { observable } from 'mobx';

export interface IUser {
    uid: string,
    DisplayName: string,
    Email: string,
    Phone: string,
    Location: UserLocation,
    Theme: 'dark'|'light'
}

@jsonObject
export class User implements IUser {
    @jsonMember({ constructor: String })
    uid: string;

    @jsonMember({ constructor: String })
    DisplayName: string;

    @jsonMember({ constructor: String })
    Phone: string;

    @jsonMember({ constructor: String })
    Location: UserLocation;

    @jsonMember({ constructor: String })
    Email: string;

    @observable
    @jsonMember({ constructor: String })
    Theme: 'dark'|'light';

    public static initializeBackendUserFromFirebaseUser(firebaseUser: firebase.User): IUser{
        let user = new User();
        user.uid = firebaseUser.uid;
        user.DisplayName = firebaseUser.displayName ? firebaseUser.displayName : "NA";
        user.Email = firebaseUser.email || "na@notprovided.com";
        return user;
    }
}