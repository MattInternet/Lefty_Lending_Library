import * as React from 'react';

import { Dialog, withStyles } from '@material-ui/core';

interface IAddContentDialogProps {
    open: boolean,
    onClose: any
}

const styles: any = theme => ({
    
});

class AddContentDialog extends React.Component<IAddContentDialogProps, any> {
    public render(){
        const { open, onClose } = this.props;

        return (
            <Dialog open={open} onClose={onClose}>
                Place to add books n whatnot...
            </Dialog>
        )
    }
}

export default withStyles(styles)(AddContentDialog);