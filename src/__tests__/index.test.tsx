import React from 'react';
import ReactDOM from 'react-dom';
import { Router, withRouter } from 'react-router';
import { Provider } from "mobx-react";
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../component/app';
import * as path from 'path';
import * as request from 'supertest';
import nock from 'nock';
// import * as admin from 'firebase-admin'
import * as stores from 'stores';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import * as googleoauthcaller from '../../functions/lib/index';

const browserHistory: any = createBrowserHistory();
const routerStore: any = stores.routerStore;

const history: any = syncHistoryWithStore(browserHistory, routerStore);

const nockBack: any = nock.back;

const apurl = ( process.env.REACT_APP_TEST_ENV === 'test' ? 
  'http://127.0.0.1:5000' : 'https://us-central1-leftylendinglibrary-test.cloudfunctions.net'
)
nockBack.setMode('record');
nockBack.fixtures = path.join(__dirname, '.', '__nock-fixtures__');
describe('API calls', () => {
  let agent:any;
  const AppWithRouter = withRouter(App);
  beforeAll(async() => {
    document.body.innerHTML = `
      <div id="root"></div>
    `;
    agent = await request.agent(appurl);
  });
  beforeEach(() => {
    nockBack.setMode('record');
  });
  afterEach(() => {
    // this ensures that consecutive tests don't use the snapshot created
    // by a previous test
    nockBack.setMode('wild');
    nock.cleanAll();
  });
  afterAll(() => {
    testEnv.cleanup()
  })
  test('should load app', async() => {
    const frontend: any = await shallow(
        <Provider {...stores}>
          <Router history={history}>
            <AppWithRouter/>
          </Router>
        </Provider>
    )
    expect(frontend).not.toBeNull();
    expect(frontend).toMatchSnapshot();
  })
  
  test('should reach firebase functions app', async() => {
    const { nockDone } = await nockBack(
      'app.header.json'
    );
    nock.enableNetConnect(/(us\-central1\-leftylendinglibrary\-test\.cloudfunctions\.net|accounts\.google\.com|127.0.0.1|sheets\.googleapis\.com)/);
    await agent
    .get('/authgoogleapi')
    .expect(302)
    // .expect('Location', '/oauthcallback')
    .then((res: any)=>{
      console.log(res)
      const body: any = res.body;
      expect(body).toMatchSnapshot();
      nockDone()
      // return header;
    })
    .catch((err: any)=>{
      console.log(err)
      nockDone()
    })
  });
})