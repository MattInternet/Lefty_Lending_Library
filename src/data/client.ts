import { storage } from "libs/firebase";
import { UserMethods, BookMethods, GoogleBooksMethods } from "./methods";

export class Client {
    public users: UserMethods;
    public books: BookMethods;
    public googlebooks: GoogleBooksMethods;

    constructor(){
        storage.settings({
            timestampsInSnapshots: true
        });
        this.users = new UserMethods(storage);
        this.books = new BookMethods(storage);
        this.googlebooks = new GoogleBooksMethods();
    }
}

export default new Client();