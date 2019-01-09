import * as React from 'react';

import { withStyles, Typography, AppBar, Tabs, Tab } from '@material-ui/core';
import BooksTable from 'component/content/BooksTable';

const styles: any = (theme: any) => ({
    root:{
        width:'100%',
        margin: 0,
    },
    tight: {
        marginTop: -theme.spacing.unit,
        marginLeft: -theme.spacing.unit,
        marginRight: -theme.spacing.unit,
        width: 'auto'
    }
});

interface ILibraryState {
    selectedTab: LibraryTabs
}

enum LibraryTabs {
    Books="Books",
    Magazines="Magazines",
    PDFs="PDFs",
    Misc="Miscellaneous"
}

//TODO: Remove this once its no longer used...
function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

class Library extends React.Component<any, ILibraryState> {
    async componentDidMount() {
        this.loadLibraryView();
    }

    async componentDidUpdate(prevProps: any) {
        if(prevProps.match.params.tab !== this.props.match.params.tab){
            await this.loadLibraryView();
        }
    }

    state = {
        selectedTab: LibraryTabs.Books
    };

    handleTabChange = (event: any, value: LibraryTabs) => {
        const { history } = this.props;
        history.push(value);
        this.setState({
            selectedTab: value
        })
    }

    public render() {
        
        const {
            classes
        } = this.props;

        const { selectedTab } = this.state;

        return(
            <div className={classes.root}>
                <AppBar position="static" className={classes.tight}>
                    <Tabs value={selectedTab} onChange={this.handleTabChange}>
                        <Tab label={LibraryTabs.Books} value={LibraryTabs.Books}/>
                        <Tab label={LibraryTabs.Magazines} value={LibraryTabs.Magazines}/>
                        <Tab label={LibraryTabs.PDFs} value={LibraryTabs.PDFs}/>
                        <Tab label={LibraryTabs.Misc} value={LibraryTabs.Misc}/>
                    </Tabs>
                </AppBar>
                {selectedTab === LibraryTabs.Books && <BooksTable/>}
                {selectedTab === LibraryTabs.Magazines && <TabContainer>Magazines</TabContainer>}
                {selectedTab === LibraryTabs.PDFs && <TabContainer>PDFs</TabContainer>}
                {selectedTab === LibraryTabs.Misc && <TabContainer>Miscellaneous</TabContainer>}
                
            </div>
        )
    }

    private loadLibraryView = async () => {
        const { match, history } = this.props;
        const tab = match.params.tab;
        if(!tab){
            history.replace('/');
            return;
        }
        this.setState({
            selectedTab: tab
        })
    }
}

export default withStyles(styles)(Library);