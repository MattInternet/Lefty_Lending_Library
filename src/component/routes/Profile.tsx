import * as React from 'react';
import { Fab, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import { inject, observer } from 'mobx-react';
import { AuthStore,  BookStore } from 'stores';
import { UserProfilePanel } from 'component';
import { AddContentDialog, LenderBookGrid } from 'component/content';
import { Book } from 'data/models';
import { pubsub, USER_AUTHENTICATED } from 'pubsub';

const styles: any = theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        background: theme.palette.primary.main
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }
});

interface IProfileRouteProps {
    authStore: AuthStore;
    bookStore: BookStore;
    classes?: any;
}

interface IProfileRouteState {
    addContentOpen: boolean;
    lenderBooks: Book[] | null;
}

@inject('authStore')
@inject('bookStore')
@observer
class Profile extends React.Component<IProfileRouteProps, IProfileRouteState> {

    state = {
        addContentOpen: false,
        lenderBooks: null
    }
    

    componentDidMount = async() => {
        console.log('component did mount');
        if(!this.props.authStore.userProfile){
            pubsub.subscribe(USER_AUTHENTICATED, this.onUserAuthenticated);
            return;
        }
        this.loadBooks();
    }

    onUserAuthenticated = () => {
        pubsub.unsubscribe(USER_AUTHENTICATED);
        this.loadBooks();
    }

    loadBooks = async() => {
        let lenderBooks = await this.props.bookStore.getLenderBooks(this.props.authStore.userProfile!.uid);
        this.setState({
            lenderBooks: lenderBooks
        })
    }

    public render() {
        const { classes, authStore } = this.props;
        const {
            //  userProfile
        } = authStore;
        

        return (
            <div className={classes.content}>
                <UserProfilePanel authStore={authStore} />

                <AddContentDialog open={this.state.addContentOpen} onClose={this.setAddContentVisibility(false)}/>

                <LenderBookGrid books={this.state.lenderBooks}/>

                {this.state.addContentOpen ?
                    null
                    :
                    <Fab className={classes.fab} onClick={this.setAddContentVisibility(true)}>
                        <AddIcon />
                    </Fab>
                }

            </div>
        )
    }

    setAddContentVisibility = (visible: boolean) => () => {
        this.setState({
            addContentOpen: visible
        });
    };
}

export default withStyles(styles)(Profile);