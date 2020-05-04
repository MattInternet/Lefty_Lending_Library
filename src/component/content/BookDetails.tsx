import * as React from 'react';
import { withStyles, Grid, Typography, Button, Dialog, DialogTitle } from '@material-ui/core';
// import { Book } from 'data/models';
import { ChipArray } from 'component';
import PersonIcon from '@material-ui/icons/Person';
import { observer } from 'mobx-react';
import { AuthStore } from 'stores';
import { Book } from 'data/models';
import { BookLenderTable } from '.';
// import { AuthStore } from 'stores';

const styles: any = (theme: any) => ({
    root: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    descriptionDialogContent: {
        padding: theme.spacing.unit * 4,
    }
});

interface IBookDetailsProps {
    book: Book;

    authStore?: AuthStore;

    classes: any;
}

//@inject('authStore')
@observer
class BookDetails extends React.Component<IBookDetailsProps, any> {

    state = {
        open: false
    };

    setDescriptionVisibility = (visible: boolean) => {
        this.setState({
            open: visible
        })
    }

    public render() {


        const { book, classes } = this.props;

        // let lenderGrid = authStore!.isLoggedIn ? <BookLenderTable book={book} /> : null;

        return (
            <div>
                <Grid className={classes.root} container spacing={8}>
                    <Grid item xs={2}>
                        <img alt={`Front cover for this book, ${book ? book.Title : 'is not available.'}`} src={book.ThumbnailURL ? book.ThumbnailURL : undefined} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom variant="h5">
                            {`${this.props.book ? this.props.book.Title : null}`}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">
                            {`${this.props.book ? this.props.book.Subtitle ? this.props.book.Subtitle : "" : ""}`}
                        </Typography>
                        {this.props.book ? this.props.book.Authors ?
                            <ChipArray data={this.props.book.Authors} displayCount={1} icon={<PersonIcon />} />
                            : "" : ""}
                        <Typography gutterBottom variant="subtitle1">
                            {`${this.props.book ? this.props.book.Publisher ? `Publisher: ${this.props.book.Publisher}` : "" : ""}`}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">
                            {`${this.props.book ? this.props.book.PublishedDate ? `Published: ${this.props.book.ShortPublishedDate}` : "" : ""}`}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">
                            {`${this.props.book ? this.props.book.PageCount ? `Pages: ${this.props.book.PageCount}` : "" : ""}`}
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={() => this.setDescriptionVisibility(true)}>View Description</Button>
                    </Grid>

                    <Grid item xs={7}>
                        <BookLenderTable book={book} />
                    </Grid>
                </Grid>
                <Dialog
                            open={this.state.open}
                            onClose={() => this.setDescriptionVisibility(false)}>
                            <DialogTitle>{book.Title}</DialogTitle>
                            <div className={classes.descriptionDialogContent}>
                                <Typography variant="body1">
                                    {book.Description}
                                </Typography>
                            </div>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(BookDetails);