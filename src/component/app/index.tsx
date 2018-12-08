import * as React from 'react';

import { observer, inject } from 'mobx-react';

import { DocumentHead } from '../controls'

import { Route, Switch } from 'react-router-dom';

import { AppHeader, Main } from 'component/layout';

import {HomeRoute, AboutRoute}  from 'component/routes'

import {SignInDialog} from 'component/user'

@inject('authStore')
@observer
class App extends React.Component<any,any> {

  render() {
    return (
        <React.Fragment>
                <DocumentHead />
                <AppHeader title={"Lefty Lending Library 📚"}/>
                <Main>
                    <Switch>
                        <Route path='/' exact={true} component={HomeRoute} />
                        <Route path='/about' exact={true} component={AboutRoute} />
                    </Switch>
                    <SignInDialog />
                </Main>
        </React.Fragment>


    );
  }
}

export default App;