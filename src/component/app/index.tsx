import * as React from 'react';

import { observer, inject } from 'mobx-react';

import { DocumentHead } from '../controls'

import { Route, Switch } from 'react-router-dom';

import { AppHeader, Main } from 'component/layout';

import { Home, Library, About, Profile, Admin } from 'component/routes'

import { SignInDialog } from 'component/user'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PrivateRoute from 'component/routes/PrivateRoute';

@inject('userStore')
@observer
class App extends React.Component<any, any> {

  render() {
    const { userStore } = this.props;

    const theme = createMuiTheme({
        palette: {
          type: userStore.userTheme,
          primary: {
              main: '#AA3939'
          },
          secondary: {
              main: '#FFAAAA'
          }
        },
        typography: { useNextVariants: true }
    });
    
    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                <DocumentHead />
                    <AppHeader title={"Lefty Lending Library 📚"} />
                <Main>
                    <Switch>
                        <Route path='/' exact={true} component={Home} />
                        <Route path='/library/:tab' component={Library} />
                        <Route path='/about' exact={true} component={About} />
                        <Route path='/profile' exact={true} component={Profile} />
                        <PrivateRoute path='/admin' exact={true} component={Admin} />
                    </Switch>
                    <SignInDialog />
                </Main>
            </MuiThemeProvider>
        </React.Fragment>
    );
  }
}

export default App;