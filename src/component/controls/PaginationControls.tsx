import * as React from 'react';
import { withStyles, Select, MenuItem, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

const styles: any = (theme: any) => ({
    root: {
        display: 'flex',
        flexDirection: 'row'
    },
    label: {
        alignSelf: 'center',
        marginRight: theme.spacing.unit
    }
});

export interface IPaginationControlsProps {
    classes: any;
    pageSizeOptions: number[];
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    onPageSizeChanged: (newPageSize: number)=>any;
    onChangePage: (nextPage: boolean)=>any;
}

class PaginationControls extends React.Component<IPaginationControlsProps, any> {
    
    handlePageSizeChanged = (event: any, child: any) => {
        this.props.onPageSizeChanged(child.props.value);
    }

    handleChangePage = (nextPage: boolean) => {
        this.props.onChangePage(nextPage);
    }

    public render() {
        const {
            classes,
            pageSizeOptions,
            pageSize,
            isFirstPage,
            isLastPage
        } = this.props;

        return (
            <div className={classes.root}>
                <Typography variant="overline" className={classes.label}>Rows per page:</Typography>
                <Select value={pageSize} onChange={this.handlePageSizeChanged}>
                    {pageSizeOptions.map(data => {
                        return <MenuItem key={data} value={data}>{data}</MenuItem>
                    })}
                </Select>
                <IconButton disabled={isFirstPage} onClick={()=>this.handleChangePage(false)}>
                    <NavigateBefore/>
                </IconButton>
                <IconButton disabled={isLastPage} onClick={()=>this.handleChangePage(true)}>
                    <NavigateNext/>
                </IconButton>
            </div>);
    }
}

export default withStyles(styles)(PaginationControls);

