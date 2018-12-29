import * as React from 'react';

import { withStyles } from '@material-ui/core';

const styles: any = (theme: any) => ({
    homeDiv: {
        display: 'flex'
    }
});

class Home extends React.Component<any, any> {
    public render() {
        const {
            classes
        } = this.props;

        return(
            <div className={classes.homeDiv}>
                Heyo, home screen ;P
            </div>
        )
    }
}

export default withStyles(styles)(Home);