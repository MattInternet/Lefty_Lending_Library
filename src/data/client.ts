import { storage } from "libs/firebase";
import { UserMethods } from "./methods/user.methods";

export class Client {
    public users: UserMethods;

    constructor(){
        this.users = new UserMethods(storage);
    }
}

export default new Client();