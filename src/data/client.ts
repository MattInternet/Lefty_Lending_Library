import { storage } from "libs/firebase";
import { UserMethods, BookMethods, GoogleBooksMethods } from "./methods";

export class Client {
    public users: UserMethods;
    public books: BookMethods;
    public googleBooks: GoogleBooksMethods;

    constructor(){
        storage.settings({
            timestampsInSnapshots: true
        });
        this.users = new UserMethods(storage);
        this.books = new BookMethods(storage);
        this.googleBooks = new GoogleBooksMethods();
    }
}

export default new Client();