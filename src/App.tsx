import * as React from 'react';

import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import { WithStyles, withStyles, createStyles, CssBaseline, Drawer, IconButton } from '@material-ui/core';
// import withRoot from '../withRoot';

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    appBar_open: {
      marginLeft: `${drawerWidth}px`,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
      marginLeft: "auto"
    }
  });

type State = {
  open: boolean;
};

class App extends React.Component<WithStyles<typeof styles>, State> {
  state = {
    open: false,
  };

  toggleDrawer = (open_drawer: boolean) => () => {
    this.setState({
      open: open_drawer,
    });
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        <CssBaseline/>
        <AppBar position="fixed" className={this.props.classes.appBar}>
          <Toolbar>
            <IconButton onClick={this.toggleDrawer(true)}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Lefty Lending Library
            </Typography>
            <Avatar className={this.props.classes.avatar}>OP</Avatar>
          </Toolbar>
        </AppBar>
        <Drawer
          className={this.props.classes.drawer}
          anchor="left"
          open={this.state.open}
          classes={{
            paper: this.props.classes.drawerPaper
          }}
          onClose={ this.toggleDrawer(false)}
          >
          <div className={this.props.classes.toolbar}>
            <List>
              {['Books', 'Videos', 'Podcasts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <main className={this.props.classes.content}>
          <div className={this.props.classes.toolbar} />
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
            facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
            gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
            donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
            Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
            imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
            arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
            facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
            vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
            hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
            tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
            nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
          </Typography>
        </main>
      </div>
    );
  }
}

// export default withRoot(withStyles(styles)(App));
export default withStyles(styles)(App);