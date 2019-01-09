import * as React from 'react';

import { observer, inject } from 'mobx-react';
import { Typography, Button, Menu, MenuItem, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person'
import { AuthStore, RouterStore } from 'stores';

export interface IUserMenuProps {
    authStore?: AuthStore;
    className?: string;
    classes?: any;
    routerStore?: RouterStore;
}

const styles: any = (theme: any) => ({
    userMenu: {
        marginLeft: 'auto'
    }
});

@inject('authStore','routerStore')
@observer
class UserMenu extends React.Component<IUserMenuProps, any> {
    state = {
        anchorEl: null
    };

    public render() {
        const { authStore, className, classes } = this.props;
        const { isAuthenticated, login, initializing} = authStore!;
        const { anchorEl } = this.state;

        if (initializing) {
            return <Typography>INITIALIZING</Typography>;
        }

        if (!isAuthenticated) {
            return (
                <Button onClick={login} className={className || classes.userMenu} color="inherit">
                    Sign in
                </Button>
            )
        }
        return (
            <div className={classes.userMenu}>
                <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleOpen}>
                    <PersonIcon/>
                </IconButton>
                
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}>
                    <MenuItem onClick={this.handleNavigateToProfile}>Profile</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                    {authStore!.isAdmin ? 
                    <MenuItem onClick={this.handleNavigateToAdmin}>Admin</MenuItem>
                    : ''}
                </Menu>
            </div>
        )

    }

    handleOpen= (event:any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    private handleLogout = () => {
        this.props.authStore!.logout();
        this.handleClose();
    }

    private handleNavigateToProfile = () => {
        this.handleClose();
        this.props.routerStore!.history.push('/profile/Books')
    }

    private handleNavigateToAdmin = () => {
        this.handleClose();
        this.props.routerStore!.history.push('/admin')
    }
}

export default withStyles(styles)(UserMenu);