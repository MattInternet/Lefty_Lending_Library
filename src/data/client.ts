import { storage } from "libs/firebase";
import { UserMethods, BookMethods, GoogleBooksMethods } from "./methods";
import { PaginatedQuery } from "./paginatedQuery";
import { PaginationParameters } from "./paginationParameters";
import { Collections } from "data/collections";
import {Book, User} from "./models"
import { TypedJSON } from "typedjson";
import { pubsub, USER_AUTHENTICATED } from "pubsub";

export class Client {
    public users: UserMethods;
    public books: BookMethods;
    public googleBooks: GoogleBooksMethods;

    public paginatedBooks: PaginatedQuery<Book>;
    public paginatedLenderBooks: PaginatedQuery<Book>;

    //TODO: Maybe move this somewhere for defaults... 🤷🏻‍♂️
    private defaultPaginatedBookParameters: PaginationParameters =  new PaginationParameters({ columnName: "Title", direction: 'desc' }, 5);

    private bookSerializer: TypedJSON<Book>;

    constructor(){
        // storage.settings({
        //     timestampsInSnapshots: true
        // });
        this.users = new UserMethods(storage);
        this.books = new BookMethods(storage);
        this.googleBooks = new GoogleBooksMethods();
        this.bookSerializer = new TypedJSON<Book>(Book);
        this.paginatedBooks = new PaginatedQuery<Book>(storage, this.defaultPaginatedBookParameters, Collections.BOOKS_COLLECTION, this.bookSerializer);
        pubsub.subscribe(USER_AUTHENTICATED, this.onUserAuthenticated);
    }

    private onUserAuthenticated = async(USER_AUTHENTICATED: string, user: User|null) => {
        if(!user){
            if(this.paginatedLenderBooks){
                this.paginatedLenderBooks.shutDown();
            }
            return;
        }

        let pagingParams = new PaginationParameters({ columnName: "Title", direction: 'desc' }, 5);
        pagingParams.whereClause = {fieldPath: 'Lenders', operationString: "array-contains", value: user.uid};
        this.paginatedLenderBooks = new PaginatedQuery<Book>(storage, pagingParams, Collections.BOOKS_COLLECTION, this.bookSerializer);
    }
}

export default new Client();