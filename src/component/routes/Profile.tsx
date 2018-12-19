import * as React from 'react';
import { Fab, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'

const styles:any = theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

class Profile extends React.Component<any, any> {
    public render() {
        const { classes } = this.props;

        return(
            <div>
                PROFILE!!!!! 😎
                <Fab className={classes.fab}>
                    <AddIcon/>
                </Fab>
            </div>
        )
    }
}

export default withStyles(styles)(Profile);