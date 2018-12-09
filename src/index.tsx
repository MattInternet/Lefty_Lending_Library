import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, withRouter } from 'react-router';
import App from './component/app/';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import * as stores from 'stores';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';

const browserHistory = createBrowserHistory();
const routerStore = stores.routerStore;

const history = syncHistoryWithStore(browserHistory, routerStore);

const AppWithRouter = withRouter(App);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <AppWithRouter/>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
