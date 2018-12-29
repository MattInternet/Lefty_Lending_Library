import * as React from 'react';

import { withStyles, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography, Button, Grid, Hidden } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { bookStore } from 'stores';
import PersonIcon from '@material-ui/icons/Person'

const styles: any = theme => ({
    title:{
        margin: theme.spacing.unit
    },
    createBookButton:{

    }
});

interface IBookGridProps {
    classes: any;
    onAddContent: any;
}

@inject('bookStore')
@observer
class LenderContentGrid extends React.Component<IBookGridProps, any> {

    public render() {
        const { classes, onAddContent } = this.props;
        const { lenderBooks }=bookStore;

        return (
            <React.Fragment>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography className={classes.title} variant="h3">
                            Your Books
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Hidden smDown>
                            <Button variant="contained" color="primary" className={classes.createBookButton} onClick={onAddContent(true)}>
                                <Typography>
                                    Create A Book
                                </Typography>
                            </Button>
                        </Hidden>
                    </Grid>
                </Grid>
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