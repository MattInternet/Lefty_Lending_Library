import { jsonObject, jsonMember } from "typedjson";
import { BookCondition } from "data/enums";
import { ILenderInfo } from "./ILenderInfo";

@jsonObject
export class BookLenderInfo implements ILenderInfo{
    @jsonMember({constructor: String})
    LenderName: string;

    @jsonMember({constructor: String})
    LenderEmail: string;

    @jsonMember({ constructor: String })
    Condtion: BookCondition;

    @jsonMember({constructor: Boolean})
    PermissionToMarkup: boolean;
}