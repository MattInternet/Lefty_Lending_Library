import { TypedJSON } from "typedjson";

export class DataUtils {
    static parseItemsFromDocs<T>(docs: any[], itemSerializer: TypedJSON<T>): T[] {
        let items: T[] = [];
        docs.forEach((doc) => {
            let parsedItem: T | undefined = itemSerializer.parse(doc.data());
            if (parsedItem) {
                items.push(parsedItem);
            }
        });
        return items;
    }
}