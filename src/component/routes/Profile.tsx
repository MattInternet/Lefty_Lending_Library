import * as React from 'react';
import { Fab, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import { inject, observer } from 'mobx-react';
import { AuthStore } from 'stores';
import { UserProfilePanel } from 'component';

const styles:any = theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }
});

interface IProfileRouteProps {
    authStore: AuthStore;
    classes?: any;
}

@inject('authStore')
@observer
class Profile extends React.Component<IProfileRouteProps, any> {
    public render() {
        const { classes, authStore } = this.props;
        const {
            //  userProfile
        } = authStore;

        return(
            <div className={classes.content}>
                <UserProfilePanel authStore={authStore}/>


                <Fab className={classes.fab}>
                    <AddIcon/>
                </Fab>
            </div>
        )
    }
}

export default withStyles(styles)(Profile);