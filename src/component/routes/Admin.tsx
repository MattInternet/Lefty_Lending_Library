import * as React from 'react';
import { withStyles, Button } from '@material-ui/core';
// import { functions } from 'libs';
const styles: any = theme => ({
    googleSheetButton: {
        alignSelf: 'center'
    }
});

class Admin extends React.Component<any, any> {
    private getGoogleSheet = async () => {
      // TODO
      return;
    }
    
    public render() {
        return(
            <div>
                Admin page <span role="img" aria-label="awesome">😎</span>
                <Button variant="contained" color="primary" onClick={this.getGoogleSheet}>
                Get google sheet
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(Admin);
