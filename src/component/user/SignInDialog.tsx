import * as React from 'react';

import { inject, observer } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from 'libs';
import { Dialog } from '@material-ui/core';
import { IUserCreationInfo, ISignInDialogProps } from 'common';
import UserInfoDialog from './UserInfoDialog';

@inject('authStore')
@observer
class SignInDialog extends React.Component<ISignInDialogProps, IUserCreationInfo> {
    public render() {
        const {  authStore } = this.props;
        const {
            uiConfig,
            displayLogin,
            toggleDisplayLogin,
            newUser,
            isAuthenticatedWithFirebase
        } = authStore;

        if (!isAuthenticatedWithFirebase) {
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