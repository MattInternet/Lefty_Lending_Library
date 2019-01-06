import * as React from 'react';

import { inject, observer } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from 'libs';
import { Dialog } from '@material-ui/core';
import { IUserCreationInfo } from 'common';
import UserInfoDialog from './UserInfoDialog';

@inject('authStore')
@observer
class SignInDialog extends React.Component<any, IUserCreationInfo> {
    public render() {
        const {  authStore } = this.props;
        const {
            uiConfig,
            displayLogin,
            toggleDisplayLogin,
            newUser,
            isAuthenticated
        } = authStore;

        if (!isAuthenticated) {
            return (
                <Dialog open={displayLogin} onClose={toggleDisplayLogin}>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </Dialog>
            )
        }
        else if (!newUser) {
            return null;
        }
        return (
            <UserInfoDialog/>
        )
    }
}

export default SignInDialog;