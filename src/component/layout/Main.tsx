import * as React from 'react';

import { withStyles } from '@material-ui/core';
import { styles } from './styles';

class Main extends React.Component<any, any> {
    public render() {
        const { classes, style } = this.props;
        return (
            <div className={classes.mainRoot} style={style || {}}>
                {this.props.children}
            </div>
        )
    }
}

export default withStyles(styles)(Main);