import { client } from "data";
import { Book, LenderBookInfo } from "data/models";

//TODO: Move this to its own file...
export class BookSearchResult{
    Book: Book|null;
    BookExistsInBackend: boolean;
}

export class BookStore{
    //#region Public
    public getBook = async (isbn13: string):Promise<Book|null> => {
        return await client.books.getBook(isbn13);
    }

    public createBookIfDoesntExist = async (newBook : Book):Promise<void> => {
        if(!await this.getBook(newBook.isbn13)){
            await client.books.createBook(newBook);
        }
    }

    public createLenderBook = async (lenderBookInfo: LenderBookInfo, book: Book, userId: string):Promise<void> => {
        // await client.lenderBookInfos.createLenderBookInfo(userId, lenderBookInfo);
        await client.books.addLenderInfo(book.isbn13, userId, lenderBookInfo); //Add LenderInfo to a sub collection on the book
    }

    //Searches from the backend AND from the 🕸 for a book via isbn13
    //Accept both ISBN10 and ISBN13
    public findBookOnlineByISBN = async (isbn: string):Promise<BookSearchResult> => {
        let isbn13 = this.getIsbn13(isbn);
        let result = new BookSearchResult();
        let book = await this.getBook(isbn13);
        if(book){
            result.Book = book;
            result.BookExistsInBackend = true;
        }
        result.Book = await client.googleBooks.findBookByISBN13(isbn13);
        return result;
    }

    //TODO: Kill this...
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