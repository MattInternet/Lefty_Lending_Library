import * as React from 'react';

import { observer, inject } from 'mobx-react';

import { DocumentHead } from '../controls'

import { Route, Switch } from 'react-router-dom';

import { AppHeader, Main } from 'component/layout';

import { Home, Library, About, Profile } from 'component/routes'

import { SignInDialog } from 'component/user'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

@inject('authStore')
@observer
class App extends React.Component<any, any> {
  render() {

    const theme = createMuiTheme({
        palette: {
          type: 'dark',
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
                    </Switch>
                    <SignInDialog />
                </Main>
            </MuiThemeProvider>
        </React.Fragment>
    );
  }
}

export default App;