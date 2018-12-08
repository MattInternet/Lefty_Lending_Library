import * as React from 'react';

import { observer, inject } from 'mobx-react';
import { Typography, Button } from '@material-ui/core';

export interface IUserMenuProps {
    authStore?: any;
    className?: string;
    classes?: any;
}

interface IUserMenuState {
    menuOpen: boolean;
}

@inject('authStore')
@observer
class UserMenu extends React.Component<any, IUserMenuState> {
    state = {
        menuOpen: false,
    };

    public render() {
        const { authStore, className } = this.props;
        const { authenticated, login, initializing, logout } = authStore;

        if (initializing) {
            return <Typography>INITIALIZING</Typography>;
        }

        if (!authenticated) {
            return (
                <Button onClick={login} className={className} color="inherit">
                    Sign in
                </Button>
            )
        }
        return(
            <Button onClick={logout} className={className} color="inherit">
                    Sign Out
            </Button>
        )
        
    }

    // private handleLogout = () => {
    //     this.props.authStore.logout();
    //     this.handleMenuClose();
    // }

    // private handleMenuOpen = (event: any) => {
    //     this.setState({ menuOpen: true });
    // }

    // private handleMenuClose = () => {
    //     this.setState({ menuOpen: false });
    // }
}

export default UserMenu;