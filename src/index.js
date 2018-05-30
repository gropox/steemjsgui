import React from 'react';
import ReactDOM from 'react-dom';
import Api from './pages/Api';
import Broadcast from './pages/Broadcast';
import Method from './pages/ApiMethod';
import Operation from './pages/Operation';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Route, BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter basename={'steemjs'}>
  <div>
      <Route exact path="/" component={Api} />
      <Route exact path="/api" component={Api}/>
      <Route path="/api/:api_name/:method_name" component={Method}/>
      <Route exact path="/broadcast" component={Broadcast}/>
      <Route exact path="/broadcast/:op_name" component={Operation}/>
  </div>
  </BrowserRouter>,
  document.getElementById('root')
)

registerServiceWorker();
