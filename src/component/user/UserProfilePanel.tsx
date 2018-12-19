import * as React from 'react';

import { observer } from 'mobx-react';
import { withStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AuthStore } from 'stores';

interface IUserProfilePanelProps {
    authStore: AuthStore;
    classes?: any;
}

interface IUserProfilePanelState{
    expanded: boolean;
}

const styles: any = (theme: any) => ({
    expansionPanel: {
        width: '100%',
        margin: 0
    },
    summary: {
        width: '100%',
        [theme.breakpoints.up("sm")]: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
        },
    },
    tight: {
        marginTop: -theme.spacing.unit,
        marginLeft: -theme.spacing.unit,
        marginRight: -theme.spacing.unit
    }
});

@observer
class UserProfilePanel extends React.Component<IUserProfilePanelProps, IUserProfilePanelState>{
    state = {
        expanded: false
    }

    public render() {
        const {  classes, authStore } = this.props;
        const { userProfile }=authStore;

        return(
            <div className={classes.tight}>
                <ExpansionPanel className={classes.expansionPanel}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <div className={classes.summary}>
                            <Typography>{userProfile? userProfile.DisplayName : null}</Typography>
                            <Typography>{userProfile? userProfile.Email : null}</Typography>
                            <Typography>{userProfile? userProfile.Phone : null}</Typography>
                            <Typography>{userProfile? userProfile.Location : null}</Typography>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            🚧There will be something here... or not... I was thinking we could show the users rough location (region) on a map, maybe let them edit their profile, etc...🚧
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}

export default withStyles(styles)(UserProfilePanel);