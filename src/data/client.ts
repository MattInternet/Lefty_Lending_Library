import { storage } from "libs/firebase";
import { UserMethods, BookMethods, GoogleBooksMethods } from "./methods";
import { PaginatedQuery } from "./paginatedQuery";
import { PaginationParameters } from "./paginationParameters";
import { Collections } from "data/collections";
import {Book} from "./models"
import { TypedJSON } from "typedjson";

export class Client {
    public users: UserMethods;
    public books: BookMethods;
    public paginatedBooks: PaginatedQuery<Book>;
    public googleBooks: GoogleBooksMethods;

    constructor(){
        storage.settings({
            timestampsInSnapshots: true
        });
        this.users = new UserMethods(storage);
        this.books = new BookMethods(storage);
        this.googleBooks = new GoogleBooksMethods();

        //TODO: Maybe move this somewhere for defaults... 🤷🏻‍♂️
        let defaultPaginatedBookParameters: PaginationParameters = {pageSize: 5, sort: { columnName: "Title", direction: 'desc' }}
        let bookSerializer = new TypedJSON<Book>(Book);
        this.paginatedBooks = new PaginatedQuery<Book>(storage, defaultPaginatedBookParameters, Collections.BOOKS_COLLECTION, bookSerializer);
    }
}

export default new Client();