import * as React from 'react';
import { withStyles, Chip } from '@material-ui/core';
import { bookStore } from 'stores';
import { inject, observer } from 'mobx-react';

import MaterialTable from 'material-table';
import { Book } from 'data/models';
import PersonIcon from '@material-ui/icons/Person'

const styles: any = (theme: any) => ({
    authorChip: {
        marginRight: theme.spacing.unit
    }
});

@inject('bookStore')
@observer
class BooksTable extends React.Component<any, any> {
    public render() {
        const { classes } = this.props;
        const { filteredBooks } = bookStore;
        let emptyBooks: Book[] = [];
        return (
            <React.Fragment>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
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
                />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BooksTable);