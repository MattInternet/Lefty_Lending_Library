import * as React from 'react';
import { withStyles, Chip, Popover, List, ListItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const styles: any = (theme: any) => {
    let backgroundColor = theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];

    return {
        popover: {
            pointerEvents: 'none',
        },
        paper: {
            padding: theme.spacing.unit,
        },
        ellipsesIcon: {
            verticalAlign: 'middle',
            background: backgroundColor,
            color: theme.palette.getContrastText(backgroundColor),
            borderRadius: '50%',
            height:'100%',
            minWidth: '30px',
            marginLeft: theme.spacing.unit
        }
    }
};

interface IChipArrayProps {
    //The data to be displayed
    data: any[];

    //How many chips to render before adding the ellipses with the popover showing the rest
    displayCount: number;

    //The icon to show on the left side of the chips
    icon: React.ReactElement<any>;

    classes: any
}

class ChipArray extends React.Component<IChipArrayProps, any>{
    state = {
        open: false,
        anchorEl: null,
    };

    handlePopoverOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handlePopoverClose = () => {
        this.setState({ anchorEl: null });
    };

    public render() {
        const { data, displayCount, icon, classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        let overFlowData = data.length > displayCount ? data.slice(displayCount) : null;

        return (
            <div>
                {
                    data.slice(0, Math.min(data.length, displayCount)).map((dataItem, index) => {
                        return <Chip
                            key={`${index}-${dataItem}`}
                            icon={icon}
                            label={dataItem} />
                    })
                }
                {
                    overFlowData ?
                        <React.Fragment>
                            <MoreHorizIcon
                                className={classes.ellipsesIcon}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={this.handlePopoverOpen}
                                onMouseLeave={this.handlePopoverClose} />
                            <Popover
                                id="mouse-over-popover"
                                className={classes.popover}
                                classes={{
                                    paper: classes.paper,
                                }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={this.handlePopoverClose}
                                disableRestoreFocus
                            >
                                <List dense>
                                    {data.map((dataItem, index) => {
                                        return <ListItem dense key={`${index}-${dataItem}`}>
                                            <Chip
                                                icon={icon}
                                                label={dataItem} />
                                        </ListItem>
                                    })}
                                </List>
                            </Popover>
                        </React.Fragment>
                        : null
                }
            </div>)
    }
}

export default withStyles(styles)(ChipArray);