import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, Grid, CardContent, Typography, Card, CardHeader, Switch } from '@material-ui/core';
import { UserStore, userStore } from 'stores';

const styles: any = (theme: any) => ({

});

interface IUserSettingsPanelProps{
    classes: any,
    userStore?: UserStore;
}

@inject('userStore')
@observer
class UserSettingsPanel extends React.Component<IUserSettingsPanelProps, any>{

    handleThemeToggle = async()=>{
        if(userStore.userProfile!.Theme === 'light'){
            userStore.setUserTheme('dark');
            return;
        }
        userStore.setUserTheme('light');
    }

    public render() {
        const {userStore} = this.props;

        return (
            <Grid container spacing={16}>
                <Grid item xs={3}>
                    <Card>
                        <CardHeader title={'Theme Settings'} />
                        <CardContent>
                            <Typography variant={'body1'}>Light vs Dark</Typography>
                            <Switch
                                checked={userStore!.userTheme === 'dark'}
                                onChange={()=>this.handleThemeToggle()}
                                value={"dark"}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        )
    }
}

export default withStyles(styles)(UserSettingsPanel);