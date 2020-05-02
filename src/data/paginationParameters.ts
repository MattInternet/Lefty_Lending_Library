import { Sorting } from "@devexpress/dx-react-grid";
import { IFirebaseWhereClause } from "data";


export class PaginationParameters{
    _sort: Sorting;
    _pageSize: number;
    whereClause?: IFirebaseWhereClause

    constructor(sort: Sorting, pageSize: number){
        this._sort = sort;
        this._pageSize = pageSize;
    }

    public equals = (other: PaginationParameters, ignoreWhere: boolean = true): Boolean => {
        if(!other) return false;
        let result = other._pageSize === this._pageSize && JSON.stringify(other._sort) === JSON.stringify(this._sort);
        if(!ignoreWhere){
            result = result && (JSON.stringify(other.whereClause) === JSON.stringify(this.whereClause));
        }
        return result;
    }
}