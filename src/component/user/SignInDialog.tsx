import * as React from 'react';

import { inject, observer } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from 'libs';
import { Dialog } from '@material-ui/core';

export interface ILoginDialogProps {
    authStore?: any;
    classes?: any;
}

@inject('authStore')
@observer
class SignInDialog extends React.Component<ILoginDialogProps, any> {
    public render() {
        const {authStore} = this.props;
        const {
            uiConfig,
            displayLogin,
            toggleDisplayLogin,
        } = authStore;

        return (
            <Dialog open={displayLogin} onClose={toggleDisplayLogin}>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
            </Dialog>
        )
    }
}

export default SignInDialog;