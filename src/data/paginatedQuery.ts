import { PaginationParameters } from "./paginationParameters";
import { observable } from "mobx";
import { TypedJSON } from "typedjson";

//Currently this doesnt actually let you 'Query' ironically. It lets you paginate and sort. But I plan to add the actual 'Queryness' to it 😅
export class PaginatedQuery<T>{

//#region public
    constructor(storage: firebase.firestore.Firestore, parameters: PaginationParameters, collectionName: string, itemSerializer: TypedJSON<T>){
        this._storage = storage;
        this._itemSerializer = itemSerializer;
        this._collectionName = collectionName;
        this.setQueryParameters(parameters);
    }

    @observable
    public isFirstPage: boolean;

    @observable
    public isLastPage: boolean;

    @observable
    public paginatedCollection: any[];

    public previousPage = async () => {
        if(this._currentPage <= 0){
            return;
        }

        this._currentPage = this._currentPage -1;

        if(this._currentPage === 0){
            this.setQueryParameters(this._paginationParameters);
            return;
        }

        this._paginatedQuerySubscription = this._filteredQuery.startAfter(this._cursors[this._currentPage -1]).onSnapshot((data)=> {
            this._cursors[this._currentPage] = data.docs[data.docs.length -2];
            this.isLastPage = data.docs.length < this._paginationParameters.pageSize+1;
            let items = this.parseItemsFromDocs(data.docs.splice(0, Math.min(data.docs.length, this._paginationParameters.pageSize) ));
            this.paginatedCollection = items;
        })
    }

    public nextPage = async () => {
        if(this.isLastPage){
            return;
        }
        
        this._paginatedQuerySubscription = this._filteredQuery.startAfter(this._cursors[this._currentPage]).onSnapshot((data)=>{
            if(data.docs.length === 0){
                this.isLastPage = true;
                return;
            }
            this.isFirstPage = false;
            this._currentPage = this._currentPage + 1;
            this._cursors[this._currentPage] = data.docs[data.docs.length - 2];
            this.isLastPage = data.docs.length < this._paginationParameters.pageSize+1;
            let items = this.parseItemsFromDocs(data.docs.splice(0, Math.min(data.docs.length, this._paginationParameters.pageSize) ));
            this.paginatedCollection = items;
        })
    }

    public setQueryParameters = (parameters: PaginationParameters) => {
        this._paginationParameters = parameters;
        this._cursors=[]
        this._currentPage=0;
        this.isFirstPage = true;

        this._filteredQuery = this._storage.collection(this._collectionName);
        if(this._paginationParameters.sort){
            this._filteredQuery = this._filteredQuery.orderBy(this._paginationParameters.sort.columnName, this._paginationParameters.sort.direction)
        }
        this._filteredQuery = this._filteredQuery.limit(this._paginationParameters.pageSize+1);

        //unsubscribe if we are subscribed...
        if (this._paginatedQuerySubscription) {
            this._paginatedQuerySubscription();
        }

        this._paginatedQuerySubscription = this._filteredQuery.onSnapshot((data)=>{
            this._cursors[this._currentPage] = data.docs[data.docs.length - 2];
            this.isLastPage = data.docs.length < this._paginationParameters.pageSize+1; //Maybe do some crazy shit like get 1 more that the page size, then set the curso one result behind to see if its rly the last page!?!?!? 🤯

            let items = this.parseItemsFromDocs(data.docs.splice(0, Math.min(data.docs.length, this._paginationParameters.pageSize) ));
            this.paginatedCollection = items;
        });
    }

    public shutDown = async():Promise<void> => {
        if (this._paginatedQuerySubscription) {
            this._paginatedQuerySubscription();
        }
    }

//#endregion

//#region private
    private _storage: firebase.firestore.Firestore;
    private _paginationParameters: PaginationParameters;
    private _cursors: any[];
    private _currentPage: number;
    private _filteredQuery: any;
    private _paginatedQuerySubscription: any;
    private _itemSerializer: TypedJSON<T>;
    private _collectionName: string;

    private parseItemsFromDocs(docs: any): any[] {
        let items: T[] = [];
        docs.forEach((doc) => {
            let parsedItem: T | undefined = this._itemSerializer.parse(doc.data());
            if (parsedItem) {
                items.push(parsedItem);
            }
        });
        return items;
    }
//#endregion
}