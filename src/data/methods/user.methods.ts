import { Collections } from "data/collections";
import { User } from "data/models";
import { TypedJSON } from "typedjson";

export class UserMethods {
    private _storage: firebase.firestore.Firestore;
    private _userSerializer: TypedJSON<User>;

    constructor(storage: firebase.firestore.Firestore){
        this._storage = storage;
        this._userSerializer = new TypedJSON<User>(User);
    }

    public async getMe(userId: string): Promise<User|null> {
        let rawUser = await this._storage.collection(Collections.USERS_COLLECTION).doc(userId).get();
        if(!rawUser.exists){
            return null;
        }
        return this._userSerializer.parse(rawUser.data()) || null;
    }

    public async createUser(newUser: User){
        try{
            await this._storage.collection(Collections.USERS_COLLECTION).doc(newUser.uid).set({... newUser});
            return Promise.resolve();
        }
        catch(error){
            throw new Error(`ailed to create backend user: ${error}`);
        }
    }
}