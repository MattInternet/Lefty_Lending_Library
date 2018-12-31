import { Collections } from "data/collections";
import { Book, BookLenderInfo } from "data/models";
import { TypedJSON } from "typedjson";
import * as firebase from "firebase";

export class BookMethods{
    private _storage: firebase.firestore.Firestore;
    private _bookSerializer: TypedJSON<Book>;
    private _booksByLenderSubscription: () => any;

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
}