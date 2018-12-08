import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';
import App from './component/app/';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import * as stores from 'stores';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';

const browserHistory = createBrowserHistory();

ReactDOM.render(
  <Provider {...stores}>
    <Router history={browserHistory}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
