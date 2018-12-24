import { Collections } from "data/collections";
import { Book, LenderBookInfo } from "data/models";
import { TypedJSON } from "typedjson";
import * as firebase from "firebase";

export class BookMethods {
    private _storage: firebase.firestore.Firestore;
    private _bookSerializer: TypedJSON<Book>;

    constructor(storage: firebase.firestore.Firestore){
        this._storage = storage;
        this._bookSerializer = new TypedJSON<Book>(Book);
    }

    public async getBook(isbn13: string): Promise<Book|null> {
        let rawBook = await this._storage.collection(Collections.BOOKS_COLLECTION).doc(isbn13).get();
        if(!rawBook.exists){
            return null;
        }
        return this._bookSerializer.parse(rawBook.data()) || null;
    }

    public createBook = async (newBook : Book):Promise<void> => {
        await this._storage.collection(Collections.BOOKS_COLLECTION).doc(newBook.isbn13).set({...newBook});
    }

    public getBooksByLender = async (userId: string):Promise<Book[]|null> => {
        let rawResult = await this._storage.collection(Collections.BOOKS_COLLECTION).where(`Lenders`, "array-contains", userId).get();
        let books: Book[] = [];
        rawResult.forEach((doc)=>{
            let parsedBook: Book | undefined = this._bookSerializer.parse(doc.data());
            if(parsedBook){
                books.push(parsedBook);
            }
        })
        return books;
    }

    public async addLenderInfo(isbn13: string, userId:string, lenderBookInfo: LenderBookInfo): Promise<void> {
        await this._storage.collection(Collections.BOOKS_COLLECTION).doc(isbn13).update({
            Lenders: firebase.firestore.FieldValue.arrayUnion(userId)
        })
        await this._storage.collection(Collections.BOOKS_COLLECTION).doc(isbn13).collection(Collections.LENDERBOOKINFOS_COLLECTION).doc(userId).set({...lenderBookInfo});
    }
}