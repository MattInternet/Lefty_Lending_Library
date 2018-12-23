import { jsonObject, jsonMember } from "typedjson";
import { BookCondition } from "data/enums";

@jsonObject
export class LenderBookInfo{
    @jsonMember({constructor: String})
    LenderName: string;

    @jsonMember({constructor: String})
    LenderEmail: string;

    @jsonMember({ constructor: String })
    Condtion: BookCondition;

    @jsonMember({constructor: Boolean})
    PermissionToMarkup: boolean;
}