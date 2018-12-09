import * as React from 'react';

import { observer, inject } from 'mobx-react';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core';

export interface IUserMenuProps {
    authStore?: any;
    className?: string;
    classes?: any;
}

interface IUserMenuState {
    menuOpen: boolean;
}

const styles: any = (theme: any) => ({
    userMenu: {
        marginLeft: 'auto'
    }
});

@inject('authStore')
@observer
class UserMenu extends React.Component<IUserMenuProps, IUserMenuState> {
    state = {
        menuOpen: false,
    };

    public render() {
        const { authStore, className, classes } = this.props;
        const { authenticated, login, initializing, logout } = authStore;

        if (initializing) {
            return <Typography>INITIALIZING</Typography>;
        }

        if (!authenticated) {
            return (
                <Button onClick={login} className={className || classes.userMenu} color="inherit">
                    Sign in
                </Button>
            )
        }
        return(
            <Button onClick={logout} className={className || classes.userMenu} color="inherit">
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

export default withStyles(styles)(UserMenu);