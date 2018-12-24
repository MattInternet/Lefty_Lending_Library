import { jsonObject, jsonMember, jsonArrayMember } from "typedjson";
import { computed } from "mobx";
import { truncate } from 'lodash';

export interface IBook {
    isbn13: string
}

@jsonObject
export class Book implements IBook {
    @jsonMember({constructor: String})
    isbn13: string

    @jsonMember({constructor: String})
    Title!: string

    @jsonMember({constructor: String})
    Subtitle: string

    @jsonArrayMember(String)
    Authors!: string[]

    @jsonMember({constructor: String})
    Publisher!: string

    @jsonMember({constructor: Date})
    PublishedDate!: Date

    @jsonMember({constructor: Number})
    PageCount!: number

    @jsonMember({constructor: String})
    ThumbnailURL!: string

    @jsonMember({constructor: String})
    Description!: string

    @jsonArrayMember(String)
    Lenders: string[]

    @computed
    public get ShortDescription(): string|null{
        return this.Description ? truncate(this.Description, { length: 250 })
        : null;
    }
}