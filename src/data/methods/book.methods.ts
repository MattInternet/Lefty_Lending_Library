import { Collections } from "data/collections";
import { Book, BookLenderInfo } from "data/models";
import { TypedJSON } from "typedjson";
import * as firebase from "firebase";
import { PaginationParameters } from "data";

export class BookMethods {
    private _storage: firebase.firestore.Firestore;
    private _bookSerializer: TypedJSON<Book>;
    private _booksByLenderSubscription: () => any;
    private _filteredBooksSubscription: () => any;

    constructor(storage: firebase.firestore.Firestore) {
        this._storage = storage;
        this._bookSerializer = new TypedJSON<Book>(Book);
    }

    public async getBook(isbn13: string): Promise<Book | null> {
        let rawBook = await this._storage.collection(Collections.BOOKS_COLLECTION).doc(isbn13).get();
        if (!rawBook.exists) {
            return null;
        }
        return this._bookSerializer.parse(rawBook.data()) || null;
    }

    public createBook = async (newBook: Book): Promise<void> => {
        await this._storage.collection(Collections.BOOKS_COLLECTION).doc(newBook.isbn13).set({ ...newBook });
    }

    public async addLenderInfo(isbn13: string, userId: string, lenderBookInfo: BookLenderInfo): Promise<void> {
        await this._storage.collection(Collections.BOOKS_COLLECTION).doc(isbn13).update({
            Lenders: firebase.firestore.FieldValue.arrayUnion(userId)
        })
        await this._storage.collection(Collections.BOOKS_COLLECTION).doc(isbn13).collection(Collections.LENDERBOOKINFOS_COLLECTION).doc(userId).set({ ...lenderBookInfo });
    }

    public unsubscribeBooksByLender = () => {
        if (this._booksByLenderSubscription) {
            this._booksByLenderSubscription();
        }
    }

    /*
    *    Watches to see if a lender's books change and calls onLenderBooksChanged when it does
    */
    public subscribeToBooksByLender = async (onLenderBooksChanged: (books: Book[]) => any, userId: string) => {
        this._booksByLenderSubscription = this._storage.collection(Collections.BOOKS_COLLECTION).where(`Lenders`, "array-contains", userId).onSnapshot((data) => {
            let lenderBooks: Book[] = [];
            data.docs.forEach((doc) => {
                let parsedBook: Book | undefined = this._bookSerializer.parse(doc.data());
                if (parsedBook) {
                    lenderBooks.push(parsedBook);
                }
            });
            onLenderBooksChanged(lenderBooks);
        });
    }

    //#region FilteredBooks

    private filteredBooksQuery: any;
    private filteredBooksCursors: any;
    private filteredBooksCurrentPage: number;
    private currentPaginationParameters: PaginationParameters;
    private isLastPage: boolean;

    public previousFilteredBooks = async (onFilteredBooksChanged: (books: Book[]) => any) => {
        if (this.filteredBooksCurrentPage <= 0) {
            return;
        }

        this.filteredBooksCurrentPage = this.filteredBooksCurrentPage - 1;

        if (this.filteredBooksCurrentPage === 0) {
            await this.subscribeToFilteredBooks(onFilteredBooksChanged, this.currentPaginationParameters);
            return;
        }

        this._filteredBooksSubscription = this.filteredBooksQuery.startAfter(this.filteredBooksCursors[this.filteredBooksCurrentPage - 1]).onSnapshot((data) => {
            this.filteredBooksCursors[this.filteredBooksCurrentPage] = data.docs[data.docs.length - 1];
            let books = this.parseBooksFromDocs(data.docs);
            this.isLastPage = books.length < this.currentPaginationParameters.pageSize;
            onFilteredBooksChanged(books);
        });
    };

    public nextFilteredBooks = async (onFilteredBooksChanged: (books: Book[]) => any) => {
        if (this.isLastPage) {
            return;
        }

        this._filteredBooksSubscription = this.filteredBooksQuery.startAfter(this.filteredBooksCursors[this.filteredBooksCurrentPage]).onSnapshot((data) => {
            if(data.docs.length === 0){
                this.isLastPage = true;
                return;
            }
            this.filteredBooksCurrentPage = this.filteredBooksCurrentPage + 1;
            this.filteredBooksCursors[this.filteredBooksCurrentPage] = data.docs[data.docs.length - 1];
            let books = this.parseBooksFromDocs(data.docs);
            this.isLastPage = books.length < this.currentPaginationParameters.pageSize;
            onFilteredBooksChanged(books);
        });
    };

    public subscribeToFilteredBooks = async (onFilteredBooksChanged: (books: Book[]) => any, pagination: PaginationParameters) => {
        this.currentPaginationParameters = pagination;
        this.filteredBooksCursors = [];
        this.filteredBooksCurrentPage = 0;

        this.filteredBooksQuery = this._storage.collection(Collections.BOOKS_COLLECTION);
        if (this.currentPaginationParameters.sort) {
            this.filteredBooksQuery = this.filteredBooksQuery.orderBy(this.currentPaginationParameters.sort.columnName, this.currentPaginationParameters.sort.direction);
        }
        this.filteredBooksQuery = this.filteredBooksQuery.limit(this.currentPaginationParameters.pageSize);

        //unsubscribe if we are subscribed...
        if (this._filteredBooksSubscription) {
            this._filteredBooksSubscription();
        }
        
        this._filteredBooksSubscription = this.filteredBooksQuery.onSnapshot((data) => {
            this.filteredBooksCursors[this.filteredBooksCurrentPage] = data.docs[data.docs.length - 1];
            let books = this.parseBooksFromDocs(data.docs);
            this.isLastPage = books.length < this.currentPaginationParameters.pageSize;
            onFilteredBooksChanged(books);
        });
    }

    public unsubscribeFilteredBooks = () => {
        if (this._filteredBooksSubscription) {
            this._filteredBooksSubscription();
        }
    }
    //#endregion

    //#region private

    private parseBooksFromDocs(docs: any): Book[] {
        let books: Book[] = [];
        docs.forEach((doc) => {
            let parsedBook: Book | undefined = this._bookSerializer.parse(doc.data());
            if (parsedBook) {
                books.push(parsedBook);
            }
        });
        return books;
    }

    //#endregion
}