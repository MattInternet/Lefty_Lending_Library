export interface IUser {
    uid: string,
    DisplayName: string
}

export class User implements IUser {
    uid: string;
    DisplayName: string;

    public static fromFirebaseUser(firebaseUser: firebase.User): IUser{
        let user = new User();
        user.uid = firebaseUser.uid;
        user.DisplayName = firebaseUser.displayName ? firebaseUser.displayName : "NA";

        return user;
    }
}