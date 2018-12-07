import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';
import App from './component/app/';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import createBrowserHistory from 'history/createBrowserHistory';

const browserHistory = createBrowserHistory();

ReactDOM.render(
  <Router history={browserHistory}>
    <App />
  </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
