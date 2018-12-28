import * as React from 'react';

import { withStyles, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { bookStore } from 'stores';
import PersonIcon from '@material-ui/icons/Person'

const styles: any = theme => ({
    title:{
        margin: theme.spacing.unit
    }
});

interface IBookGridProps {
    classes: any;
}

@inject('bookStore')
@observer
class LenderContentGrid extends React.Component<IBookGridProps, any> {

    public render() {
        const { classes } = this.props;
        const { lenderBooks }=bookStore;

        return (
            <React.Fragment>
                <Typography className={classes.title} variant="h3">
                    Your Books:
                </Typography>
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
                    {lenderBooks ?
                        lenderBooks.map(book => (
                            <TableRow key={book.isbn13}>
                                <TableCell>{book.Title}</TableCell>
                                <TableCell>{book ? book.Authors ?
                                        book.Authors.map(data => {
                                            return <Chip
                                                key={data}
                                                icon={<PersonIcon />}
                                                label={data}
                                                className={classes.authorChip}
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

export default withStyles(styles)(LenderContentGrid);