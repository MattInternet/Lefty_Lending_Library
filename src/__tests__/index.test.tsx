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
// import MockSyncGoogleSheetDialog from './fixtures/SyncGoogleSheetDialog';
import * as stores from 'stores';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import * as googleoauthcaller from '../../functions/lib/index';
// import * as sinon from 'sinon';
// const testFn = require('firebase-functions-test');

const browserHistory: any = createBrowserHistory();
const routerStore: any = stores.routerStore;

const history: any = syncHistoryWithStore(browserHistory, routerStore);

const nockBack: any = nock.back;
// const recording = process.env.REACT_APP_RECORD_ENV;
// const testing = process.env.REACT_APP_TEST_ENV;
// if (!recording) {
// 
// } else {
//   nockBack.setMode('record');
// }
// const serviceAccount: string = '../firebasesecrets/leftylendinglibrary-test-firebase-adminsdk-ogchy-a7088952aa.json'//path.join(__dirname, '..', 'firebasesecrets/leftylendinglibrary-test-firebase-adminsdk-ogchy-a7088952aa.json')
// // const functionsConfing = path.join(__dirname, '')
// const testEnv:any = 
// testFn({
//   databaseURL: 'https://leftylendinglibrary-test.firebaseio.com',
//   storageBucket: 'leftylendinglibrary-test.appspot.com',
//   projectId: 'leftylendinglibrary-test',
// }, serviceAccount);

// const adminInitStub = sinon.stub(admin, 'initializeApp')

nockBack.setMode('record');
nockBack.fixtures = path.join(__dirname, '.', '__nock-fixtures__');
describe('API calls', () => {
  let agent:any;
  const AppWithRouter = withRouter(App);
  beforeAll(async() => {
    document.body.innerHTML = `
      <div id="root"></div>
    `;
    // testapp = app;
    // await googleoauthcaller.app.listen(5000, async() => {
    //   console.log('connected');
      agent = await request.agent('https://us-central1-leftylendinglibrary-test.cloudfunctions.net');
      // agent.get('/').expect(200, done)
      // console.log(agent)
    // })
    // googleSheets = await new SyncGoogleSheetDialog();

    // await ReactDOM.render(
    //   <Provider {...stores}>
    //     <Router history={history}>
    //       <AppWithRouter/>
    //     </Router>
    //   </Provider>,
    //   document.getElementById('root') as HTMLElement
    // );
    // const renderedDiv = document.getElementById('root');
    // expect(renderedDiv).not.toBeNull()
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
    // const functionsConfig:any = require('../firebasesecrets/leftylendinglibrary-test.config.json');
    // const CONFIG_CLIENT_ID = functionsConfig.client_id;
    // const CONFIG_CLIENT_SECRET = functionsConfig.client_secret;
    // const CONFIG_SHEET_ID = functionsConfig.sheet_id;
    // 
    // testEnv.mockConfig({
    //   googleapi: {
    //     client_id: CONFIG_CLIENT_ID,
    //     client_secret: CONFIG_CLIENT_SECRET,
    //     sheet_id: CONFIG_SHEET_ID
    //   }
    // })
    // const req:any = { url: 'https://leftylendinglibrary-test.web.app' };
    // // A fake response object, with a stubbed redirect function which asserts that it is called
    // // with parameters 303, 'new_ref'.
    // const res:any = {
    //   redirect: (code, url) => {
    //     expect(code).toEqual(303);
    //     // assert.equal(url, 'new_ref');
    //     // done();
    //   }
    // };
    // nock.enableNetConnect('us-central1-leftylendinglibrary-test.cloudfunctions.net');
    // googleoauthcaller(req, res);
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
    // nockDone()
    
  
  });

  // key = 'should get a header';
  // test(key, async () => {
  //   // const snapKey = ('API calls '+key+' 1');
  //   const { nockDone } = await nockBack(
  //     'app.header.json'
  //   );
  //   // const { getAuthCode } = authMiddleware;
  //   nock.enableNetConnect('127.0.0.1');
  //   await agent
  //   .get('/')
  //   .expect(302)
  //   .expect('Location', '/home')
  //   .then((res)=>{
  //     header = res.header;
  //     expect(header).to.matchSnapshot();
  //   })
  //   nockDone()
  // })
})