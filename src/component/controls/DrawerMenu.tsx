import * as React from 'react';

import { withStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles: any = (theme: any) => ({
    root: {
        fontFamily: 'Roboto, sans-serif',
    },
    drawerHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        minHeight: theme.mixins.toolbar.minHeight,
        color: theme.palette.text.primary,
        [theme.breakpoints.up("sm")]: {
            minHeight: theme.spacing.unit,
        },
        [theme.breakpoints.down("xs")]: {
            padding: '0 16px',
        },
        zIndex: 1,
    },
    drawerTitle: {
        textAlign: 'center'
    },
    closeButton: {
        marginRight: 4
    },
    drawerContent: {
        width: 350,
        padding: '11px 24px',
        maxWidth: '100%',
        [theme.breakpoints.down("xs")]: {
            padding: '11px 16px',
        },
    }
});

export interface IDrawerNavProps {
    open: boolean;
    onClose: () => void;
    classes?: any;
    title?: string;
    children: any;
    anchor?: 'left' | 'top' | 'bottom' | 'right';
    headerClassName?: string;
    contentStyle?: any;
}

class DrawerMenu extends React.Component<IDrawerNavProps, {}>{
    public render() {
        const {
            open,
            classes,
            title,
            children,
            anchor,
            headerClassName,
            contentStyle,
        } = this.props;

        return (
            <Drawer
                open={open}
                onClose={this.handleClose}
                className={classes.root}
                anchor={anchor || 'left'}
            >
                <div className={headerClassName || classes.drawerHeader}>
                    {
                        title
                            ?
                            <Typography className={classes.drawerTitle} variant="h6" color="inherit">
                                {title}
                            </Typography>
                            : <div />
                    }
                    <IconButton onClick={this.handleClose} className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider />
                <div className={classes.drawerContent} style={contentStyle}>
                    {children}
                </div>
            </Drawer>
        )
    }

    private handleClose = () => {
        this.props.onClose();
    }
}

export default withStyles(styles)(DrawerMenu);
