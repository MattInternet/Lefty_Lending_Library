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
import { BookDetails } from '.';

const styles: any = (theme: any) => ({
});

interface IBooksTableState {
    sorting: Sorting[],
    pageSize: number;
}

@inject('bookStore')
@observer
class BooksTable extends React.Component<any, IBooksTableState> {
    constructor(props: any) {
        super(props);

        this.state = {
            sorting: [{ columnName: "Title", direction: 'desc' }],
            pageSize: 10
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
        { name: 'Authors', title: 'Author(s)', getCellValue: row => (row.Authors ? <ChipArray data={row.Authors} displayCount={1} icon={<PersonIcon />} /> : null) },
        { name: 'Publisher', title: 'Publisher' },
        { name: 'PublishedDate', title: 'Published', getCellValue: row => (row.PublishedDate ? row.ShortPublishedDate : null) },
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
        const { sorting, pageSize } = this.state;
        const { paginatedBooks, isFirstPaginatedBooksPage, isLastPaginatedBooksPage } = bookStore;
        return (
            <React.Fragment>
                <Grid columns={this.columns} rows={paginatedBooks || []}>
                    <RowDetailState />
                    <SortingState
                        sorting={sorting}
                        onSortingChange={this.changeSorting}
                    />

                    <Table />
                    <TableHeaderRow showSortingControls />
                    <TableRowDetail
                        contentComponent={({ row }) => (
                            <BookDetails book={row} />
                        )}
                    />
                </Grid>
                <PaginationControls
                    pageSizeOptions={[5, 10, 15, 20, 25, 50]}
                    pageSize={pageSize}
                    onPageSizeChanged={this.changePageSize}
                    onChangePage={this.changePage}
                    isFirstPage={isFirstPaginatedBooksPage}
                    isLastPage={isLastPaginatedBooksPage} />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BooksTable);