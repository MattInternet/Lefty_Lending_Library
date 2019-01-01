import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import PersonIcon from '@material-ui/icons/Person';

import {
    Grid, Table, TableHeaderRow, TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import {
    SortingState, Sorting, RowDetailState
} from '@devexpress/dx-react-grid';
import { bookStore } from 'stores';
import { PaginationParameters } from 'data';
import { PaginationControls, ChipArray } from 'component/controls';

const styles: any = (theme: any) => ({
    authorChip: {
        marginRight: theme.spacing.unit
    }
});

interface IBooksTableState {
    sorting: Sorting[],
    pageSize: number;
}

const RowDetail = ({ row }) => (
    <div>
        Details for
      {' '}
        {row.Title}
        {' '}
    </div>
);

@inject('bookStore')
@observer
class BooksTable extends React.Component<any, IBooksTableState> {
    constructor(props: any) {
        super(props);

        this.state = {
            sorting: [{ columnName: "Title", direction: 'desc' }],
            pageSize: 5
        }
    }

    componentDidMount() {
        this.updateData();
    }

    componentDidUpdate() {
        this.updateData();
    }

    columns = [
        { name: 'Title', title: 'Title' },
        { name: 'Publisher', title: 'Publisher' },
        { name: 'PublishedDate', title: 'Published', getCellValue: row => (row.PublishedDate ? row.ShortPublishedDate : null) },
        // {
        //     name: 'Authors', title: 'Author(s)', getCellValue: row => (row.Authors ? row.Authors.map(data => {
        //         return <Chip
        //             key={data}
        //             icon={<PersonIcon />}
        //             label={data}
        //         />
        //     }) : null)
        // },
        {
            name: 'Authors', title: 'Author(s)', getCellValue: row => (row.Authors ? <ChipArray data={row.Authors} displayCount={1} icon={<PersonIcon/>}/> : null)
        },
        { name: 'PageCount', title: 'Pages' }
    ];

    changeSorting = (sorting) => {
        this.setState({
            sorting
        });
    }

    changePageSize = (newPageSize) => {
        this.setState({
            pageSize: newPageSize
        });
    }

    generatePaginationParameters() {
        const { sorting, pageSize } = this.state;
        let paginationHelper: PaginationParameters = { sort: sorting[0], pageSize: pageSize };
        return paginationHelper;
    }

    oldpaginationParams: PaginationParameters;

    updateData = () => {
        let paginationParams = this.generatePaginationParameters();
        if (JSON.stringify(paginationParams) != JSON.stringify(this.oldpaginationParams)) {
            this.oldpaginationParams = paginationParams;
            bookStore.setPaginatedBooksParameters(paginationParams);
        }
    }

    changePage = async (nextPage) => {
        if (nextPage) {
            await bookStore.getNextPaginatedBooks();
            return;
        }
        await bookStore.getPreviousPaginatedBooks();
    }

    public render() {
        // const { classes } = this.props;
        const { sorting, pageSize } = this.state;
        const { paginatedBooks, isFirstPaginatedBooksPage, isLastPaginatedBooksPage } = bookStore;
        return (
            <React.Fragment>
                <Grid columns={this.columns} rows={paginatedBooks || []}>
                    <RowDetailState/>
                    <SortingState
                        sorting={sorting}
                        onSortingChange={this.changeSorting}
                    />

                    <Table />
                    <TableHeaderRow showSortingControls />
                    <TableRowDetail
                        contentComponent={RowDetail}
                    />
                </Grid>
                <PaginationControls
                    pageSizeOptions={[5, 10, 15, 20, 25, 50]}
                    pageSize={pageSize}
                    onPageSizeChanged={this.changePageSize}
                    onChangePage={this.changePage}
                    isFirstPage={isFirstPaginatedBooksPage}
                    isLastPage={isLastPaginatedBooksPage} />

                {/* <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                <MaterialTable
                    title="Demo Title"
                    
                    options={{
                        toolbar: false
                    }}
                    columns={[
                        { title: 'Title', field: 'Title' },
                        {
                            title: 'Author(s)', field: 'Authors',
                            render: (rowData: Book) => {
                                return (
                                    <div>
                                        {rowData.Authors ?
                                            rowData.Authors.map(data => {
                                                return <Chip
                                                    key={data}
                                                    icon={<PersonIcon />}
                                                    label={data}
                                                    className={classes.authorChip}
                                                />
                                        }) : ""}
                                    </div>
                                );
                            }
                        },
                        { title: 'Publisher', field: 'Publisher' },
                        { title: 'PublishedDate', field: 'PublishedDate', type: 'date' },
                        { title: 'Pages', field: 'PageCount', type: 'numeric' },
                    ]}
                    data={filteredBooks || emptyBooks}
                /> */}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BooksTable);