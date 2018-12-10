import { Collections } from "data/collections";
import { IUser } from "data/models/User";

export class UserMethods {
    private _storage: firebase.firestore.Firestore;

    constructor(storage: firebase.firestore.Firestore){
        this._storage = storage;
        this._storage.settings({
            timestampsInSnapshots: true
        });
    }

    public getMe = (userId: string): Promise<any> => { //TODO: Make this return a 'User' type, not any
        return this._storage.collection(Collections.USERS_COLLECTION).doc(userId).get();
    }

    public createBackendUser = (newUser: IUser): Promise<any> =>{
        try{
            return this._storage.collection(Collections.USERS_COLLECTION).doc(newUser.uid).set({
                uid: `${newUser.uid}`,
                DisplayName: `${newUser.DisplayName}`,
            })
        }
        catch(error){
            throw new Error("Failed to create backend user!");
        }
    }
}