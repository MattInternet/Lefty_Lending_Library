import * as React from 'react';

import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { DrawerMenu, DrawerMenuNavItem } from 'component/controls';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { styles } from './styles';

import { UserMenu } from 'component/user'

export interface IHeaderProps {
    title?: string
    classes?: any;
}

class AppHeader extends React.Component<IHeaderProps, any>{
    state = {
        open: false,
    };

    toggleDrawer = (open_drawer: boolean) => () => {
        this.setState({
            open: open_drawer,
        });
    };

    public render() {

        const {
            classes
        } = this.props;

        return (
            <AppBar position="fixed">
                <DrawerMenu
                    open={this.state.open}
                    onClose={this.toggleDrawer(false)}
                    title={"Lefty Lending Library"}>
                    <div className={classes.navItemList}>
                        <DrawerMenuNavItem destination="/" title={'Home'} onClick={this.toggleDrawer(false)}/>
                        
                        <DrawerMenuNavItem destination="/about" title={'About'} onClick={this.toggleDrawer(false)}/>
                    </div>
                </DrawerMenu>
                <Toolbar className={classes.toolbar}>
                    <IconButton onClick={this.toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    {this.props.title}
                    <UserMenu />
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(AppHeader);