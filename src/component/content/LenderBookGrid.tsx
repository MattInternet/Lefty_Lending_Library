import * as React from 'react';

import { Book } from 'data/models';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { SimpleBookView } from '.';

const styles: any = theme => ({
    bookGrid: {
        width: '100%',
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        justifyContent: 'center'
    }
});

interface IBookGridProps {
    books: Book[] | null;
    classes: any;
}

@inject('bookStore')
@observer
class LenderBookGrid extends React.Component<IBookGridProps, any> {

    public render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Grid className={classes.bookGrid} container spacing={32}>
                    {this.props.books ?
                        this.props.books.map(book => (
                            <Grid key={book.isbn13} item>
                                <SimpleBookView small={true} book={book}/>
                            </Grid>
                        ))
                        :
                        null}
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(LenderBookGrid);