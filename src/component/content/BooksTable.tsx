import * as React from 'react';
import { withStyles, TableHead, Table, TableRow, TableCell, TableBody, Chip } from '@material-ui/core';
import { bookStore } from 'stores';
import { inject, observer } from 'mobx-react';
import PersonIcon from '@material-ui/icons/Person'

const styles: any = (theme: any) => ({

});

@inject('bookStore')
@observer
class BooksTable extends React.Component<any, any> {

    public render() {
        // const { classes } = this.props;
        const { filteredBooks } = bookStore;

        return (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Authors</TableCell>
                            <TableCell align="right">Publisher</TableCell>
                            <TableCell align="right">Published Date</TableCell>
                            <TableCell align="right">Pages</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredBooks ?
                        filteredBooks.map(book => (
                            <TableRow key={book.isbn13}>
                                <TableCell>{book.Title}</TableCell>
                                <TableCell>{book ? book.Authors ?
                                        book.Authors.map(data => {
                                            return <Chip
                                                key={data}
                                                icon={<PersonIcon />}
                                                label={data}
                                            />
                                        })
                                        : "" : ""}</TableCell>
                                <TableCell>{book.Publisher}</TableCell>
                                <TableCell>{book.ShortPublishedDate}</TableCell>
                                <TableCell>{book.PageCount}</TableCell>
                            </TableRow>
                        ))
                        :
                        null}
                    </TableBody>
                </Table>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BooksTable);