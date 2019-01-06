import * as React from 'react';

import { observer } from 'mobx-react';
import { withStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { UserStore } from 'stores';
import { UserSettingsPanel } from '.';

interface IUserProfilePanelProps {
    userStore: UserStore;
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
    },
    settingsIcon: {
        marginLeft: 'auto'
    }
});

@observer
class UserProfilePanel extends React.Component<IUserProfilePanelProps, IUserProfilePanelState>{
    state = {
        expanded: false
    }

    public render() {
        const {  classes, userStore } = this.props;
        const { userProfile }=userStore;

        return(
            <div className={classes.tight}>
                <ExpansionPanel className={classes.expansionPanel}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <div className={classes.summary}>
                            <Typography>{userProfile? userProfile.DisplayName : null}</Typography>
                            <Typography>{userProfile? userProfile.Email : null}</Typography>
                            <Typography>{userProfile? userProfile.Phone : null}</Typography>
                            <Typography>{userProfile? userProfile.Location : null}</Typography>
                        </div>
                        <Typography>
                            <SettingsIcon className={classes.settingsIcon}/>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <UserSettingsPanel/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}

export default withStyles(styles)(UserProfilePanel);