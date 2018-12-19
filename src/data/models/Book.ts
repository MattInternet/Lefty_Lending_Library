import { jsonObject, jsonMember, jsonArrayMember } from "typedjson";

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
}