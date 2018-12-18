import * as React from 'react';

import { observer, inject } from 'mobx-react';

import { DocumentHead } from '../controls'

import { Route, Switch } from 'react-router-dom';

import { AppHeader, Main } from 'component/layout';

import {Home, About, Profile}  from 'component/routes'

import {SignInDialog} from 'component/user'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';

@inject('authStore')
@observer
class App extends React.Component<any,any> {
  render() {

    const theme = createMuiTheme({
        palette: {
          type: 'dark',
          primary: {
              main: '#b71c1c'
          },
          secondary: pink
        },
        typography: { useNextVariants: true }
    });
    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                <DocumentHead />
                <AppHeader title={"Lefty Lending Library 📚"}/>
                <Main>
                    <Switch>
                        <Route path='/' exact={true} component={Home} />
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