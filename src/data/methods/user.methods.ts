import { Collections } from "data/collections";
import { User } from "data/models/User";
import { TypedJSON } from "typedjson";

export class UserMethods {
    private _storage: firebase.firestore.Firestore;
    private _serializer: TypedJSON<User>;

    constructor(storage: firebase.firestore.Firestore){
        this._storage = storage;
        this._storage.settings({
            timestampsInSnapshots: true
        });
        this._serializer = new TypedJSON<User>(User);
    }

    public async getMe(userId: string): Promise<User|null> { //TODO: Make this return a 'User' type, not any
        let rawUser = await this._storage.collection(Collections.USERS_COLLECTION).doc(userId).get();
        if(!rawUser.exists){
            return null;
        }
        return this._serializer.parse(rawUser.data()) || null;
    }

    public async createUser(newUser: User){
        try{
            await this._storage.collection(Collections.USERS_COLLECTION).doc(newUser.uid).set({... newUser});
            return Promise.resolve();
        }
        catch(error){
            throw new Error("Failed to create backend user!");
        }
    }
}