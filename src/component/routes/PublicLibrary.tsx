import * as React from 'react';

import { withStyles } from '@material-ui/core';
import { LibraryView } from 'component/content';

const styles: any = (theme: any) => ({
    tightTop: {
        marginTop: -theme.spacing.unit
    }
});

class PublicLibrary extends React.Component<any, any> {

    public render() {
        const {match, history, classes} = this.props;
        return (
            <div className={classes.tightTop}>
                <LibraryView variant={'public'} match={match} history={history} />
            </div>
        )
    }
}

export default withStyles(styles)(PublicLibrary);