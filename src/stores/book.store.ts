import { client } from "data";
import { Book } from "data/models";

export class BookStore{
    //#region Public
    public getBook = async (isbn13: string):Promise<Book|null> => {
        return await client.books.getBook(isbn13);
    }

    //Searches online (not from our backend) for a bok by ISBN.
    //Accept both ISBN10 and ISBN13
    public findBookOnlineByISBN = async (isbn: string):Promise<Book|null> => {
        let isbn13 = this.getIsbn13(isbn);
        return await client.googlebooks.findBookByISBN13(isbn13);
    }

    public testFindBook = () =>  {
        this.findBookOnlineByISBN("9781451648546");
    }

    public getIsbn13 = (isbn: string) => {
        //TODO: If isbn is isbn13 return, if its isbn10 then make an isbn13 ;P Currently only supports ISBN10 and errors on 13
        if(isbn.length != 13){
            throw new Error('getIsbn13 isnt implemented yet 😱');
        }
        return isbn;
    }
    //#endregion
}

export default new BookStore();

//Code to convert isbn10 to isbn13
// var isbn10 = $("#isbn").val().replace(/[- –]/g,"");
// 		var chars = isbn10.split("");
// 		if (isbn10.length < 10 || isbn10.length > 10)
// 		{
// 			alert("This 10-digit ISBN is invalid.");
// 			return(false)
// 		}
//       	chars.unshift("9", "7", "8");
//       	chars.pop();
// 		var i = 0;
// 		var sum = 0;
// 		for (i = 0; i < 12; i += 1) {
// 			  sum += chars[i] * ((i % 2) ? 3 : 1);
// 		}
// 		var check_digit = (10 - (sum % 10)) % 10;
// 		chars.push(check_digit);
  
// 		var isbn13 = chars.join("");