import * as React from 'react';

import { Dialog, withStyles, Button } from '@material-ui/core';
import { inject } from 'mobx-react';
import { bookStore } from 'stores';

interface IAddContentDialogProps {
    open: boolean,
    onClose: any
}

const styles: any = theme => ({
    
});

@inject('bookStore')
class AddContentDialog extends React.Component<IAddContentDialogProps, any> {
    
    
    public render(){
        const { open, onClose } = this.props;
        const { testFindBook } = bookStore;

        return (
            <Dialog open={open} onClose={onClose}>
                Place to add books n whatnot...
                <Button onClick={testFindBook}>
                    TEST
                </Button>
            </Dialog>
        )
    }
}

export default withStyles(styles)(AddContentDialog);