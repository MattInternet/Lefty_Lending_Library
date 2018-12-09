import * as React from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import {History} from 'history';
import { Link } from 'react-router-dom';

export interface IDrawerMenuItemProps {
    title?: string;
    onClick?: any;
    destination: History.LocationDescriptor;
    classes?: any;
}

const styles: any = (theme: any) => ({
    navButton: {
        margin: theme.spacing.unit,
        justifyContent: 'left'
    }
});

class DrawerMenuNavItem extends React.Component<IDrawerMenuItemProps,any>{
    public render(){
        const {
            title,
            onClick,
            destination,
            classes
        } = this.props;

        const link = props =>
        <Link to={destination} {...props}>
            <Typography>
                {title}
            </Typography>
        </Link>

        return (
            <Button className={classes.navButton} onClick={onClick} component={link}/>
        )
    }
}

export default withStyles(styles)(DrawerMenuNavItem);