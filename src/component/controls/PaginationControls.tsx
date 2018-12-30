import * as React from 'react';
import { withStyles, Select, MenuItem } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

const styles: any = (theme: any) => ({
    root: {
        display: 'flex',
        flexDirection: 'row'
    }
});

export interface IPaginationControlsProps {
    classes: any;
    pageSizeOptions: number[];
    pageSize: number;
    onPageSizeChanged: (newPageSize: number)=>any;
    onChangePage: (nextPage: boolean)=>any;
}

interface IPaginationControlsState {

}

class PaginationControls extends React.Component<IPaginationControlsProps, IPaginationControlsState> {
    
    handlePageSizeChanged = (event: any, child: any) => {
        this.props.onPageSizeChanged(child.props.value);
    }

    handleChangePage = (nextPage: boolean) => {
        this.props.onChangePage(nextPage);
    }

    public render() {
        const { classes,
            pageSizeOptions,
            pageSize
        } = this.props;

        return (
            <div className={classes.root}>
                <Select value={pageSize} onChange={this.handlePageSizeChanged}>
                    {pageSizeOptions.map(data => {
                        return <MenuItem key={data} value={data}>{data}</MenuItem>
                    })}
                </Select>
                <IconButton onClick={()=>this.handleChangePage(false)}>
                    <NavigateBefore/>
                </IconButton>
                <IconButton onClick={()=>this.handleChangePage(true)}>
                    <NavigateNext/>
                </IconButton>
            </div>);
    }
}

export default withStyles(styles)(PaginationControls);

