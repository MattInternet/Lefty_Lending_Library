import * as React from 'react';

import { Dialog, withStyles, Button, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField, Chip, Tooltip } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { bookStore, authStore } from 'stores';
import { Book, BookLenderInfo } from 'data/models';
import { SimpleBookView } from '.';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { BookCondition } from 'data/enums';

interface IAddContentDialogProps {
    open: boolean,
    onClose: any,
    classes: any
}

interface IAddContentDialogState {
    pendingBook: Book | null;
    pendingISBN: string | null;
    bookExistsInBackend: boolean;
}

const styles: any = theme => ({
    ISBNInput: {
        margin: theme.spacing.unit*3,
        maxWidth: 300
    },
    chip: {
        marginLeft: theme.spacing.unit
    }
});

const initialState = {
    pendingBook: null,
    pendingISBN: "",
    bookExistsInBackend: false
};

@inject('bookStore')
@inject('authStore')
@observer
class AddContentDialog extends React.Component<IAddContentDialogProps, IAddContentDialogState> {
    state = initialState;

    private handleSearchISBN = async() => {
        if(!this.state.pendingISBN){
            alert('Please input an ISBN'); //TODO: Make the error display better
            return;
        }
        if(this.state.pendingISBN.length != 13){
            alert('Only 13 digit ISBNs are supported (FOR THE MOMENT!)'); //TODO: Make the error display better
            return;
        }
        let searchResult = await bookStore.findBookOnlineByISBN(this.state.pendingISBN);
        if(!searchResult.Book){
            alert('I couldnt find that book 😱, sry...'); //TODO: Make the error display better
            return;
        }
        this.setState({
            pendingBook: searchResult.Book,
            bookExistsInBackend: searchResult.BookExistsInBackend,
            pendingISBN: ""
        });
    }

    private handleChange = (field: string) => (event) => {
        this.setState({ [field]: event.target.value } as Pick<IAddContentDialogState, any>);
    };

    private handleClose = () => {
        this.setState(initialState);
        this.props.onClose();
    }

    private handleAddBook = async() => {
        //TODO: Get LenderBookInfo from the UI 😁
        let fakeLenderBookInfo = new BookLenderInfo();
        fakeLenderBookInfo.Condtion = BookCondition.Like_New;
        fakeLenderBookInfo.LenderEmail = authStore.userProfile!.Email;
        fakeLenderBookInfo.LenderName = authStore.userProfile!.DisplayName;
        fakeLenderBookInfo.PermissionToMarkup = false;

        if(this.state.pendingBook){
            await bookStore.createBookAndAssociateWithLender(fakeLenderBookInfo, this.state.pendingBook!, authStore.userProfile!.uid);
        }

        this.handleClose();
    }

    public render() {
        const { classes, open } = this.props;

        //Find the book
        if(!this.state.pendingBook){
            return (
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>Search for a Book</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Search for a book by ISBN. ISBNs are 10 or 13 digits and can usually be found near a book's barcode
                        </DialogContentText>
                    </DialogContent>
                    <TextField
                        className={classes.ISBNInput}
                        autoFocus
                        id="isbnInput"
                        label="ISBN"
                        type="text"
                        onChange={this.handleChange('pendingISBN')}
                        margin="normal"/>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSearchISBN}>
                            Search
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        }
        //Confirm/Add the book
        return (
            <Dialog open={open} onClose={this.handleClose}>
                <DialogTitle>Does this look right?
                {this.state.bookExistsInBackend ?
                        <Tooltip title="The more the merrier!" aria-label="The more the merrier!" placement="bottom-end">
                            <Chip
                            variant="outlined"
                            icon={<CheckCircleIcon />}
                            label="This Book currently exists in the LLL!"
                            className={classes.chip}
                            color="secondary"/>
                        </Tooltip>
                        :
                        null}
                </DialogTitle>
                <DialogContent>
                    <SimpleBookView book={this.state.pendingBook}/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={this.handleAddBook}>
                        Looks good!
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(AddContentDialog);