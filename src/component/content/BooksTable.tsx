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
import { PaginationParameters, PaginatedQuery } from 'data';
import { PaginationControls, ChipArray } from 'component/controls';
import { BookDetails } from '.';
import { Book } from 'data/models';

const styles: any = (theme: any) => ({
});

interface IBooksTableState {
    sorting: Sorting[],
    pageSize: number;
}

interface IBooksTableProps {
    variant: 'public' | 'user'
}

@inject('bookStore')
@observer
class BooksTable extends React.Component<IBooksTableProps, IBooksTableState> {
    private books: PaginatedQuery<Book>;

    constructor(props: any) {
        super(props);

        this.books = this.props.variant === "public" ? bookStore.paginatedBooks : bookStore.paginatedLenderBooks;
        
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
        return new PaginationParameters(sorting[0], pageSize);
    }

    oldpaginationParams: PaginationParameters;

    updateData = () => {
        let paginationParams = this.generatePaginationParameters();
        if (this.books && !paginationParams.equals(this.oldpaginationParams)) {
            this.oldpaginationParams = paginationParams;
            this.books.setQueryParameters(paginationParams);
        }
    }

    changePage = async (nextPage) => {
        if (nextPage) {
            await this.books.nextPage();
            return;
        }
        await this.books.previousPage();
    }

    public render() {
        const { sorting, pageSize } = this.state;

        return (
            <React.Fragment>
                <Grid columns={this.columns} rows={!this.books ? [] : this.books.paginatedCollection || []}>
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
                    isFirstPage={this.books && this.books.isFirstPage}
                    isLastPage={this.books && this.books.isLastPage} />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BooksTable);