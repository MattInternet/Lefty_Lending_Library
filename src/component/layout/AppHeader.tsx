import * as React from 'react';

import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DrawerMenu from '../controls/DrawerMenu';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Link } from 'react-router-dom';
import { styles } from './styles';

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
        return (
            <AppBar position="fixed">
                <DrawerMenu
                    open={this.state.open}
                    onClose={this.toggleDrawer(false)}
                    title={"Lefty Lending Library"}>
                    <Link to="/about">
                        About
                    </Link>
                </DrawerMenu>
                <Toolbar>
                    <IconButton onClick={this.toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    {this.props.title}
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(AppHeader);