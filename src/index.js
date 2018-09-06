import React from 'react';
import ReactDOM from 'react-dom';
import Api from './pages/Api';
import Method from './pages/ApiMethod';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import "bootstrap/dist/css/bootstrap.css"
//import "bootstrap/dist/css/cerulean.css"

ReactDOM.render(
  <BrowserRouter basename={'steemjs'}>
  <Switch>
      <Route exact path="/" component={(props) => <Api {...props} />} />
      <Route exact path="/api" component={(props) => <Api {...props} />}/>
      <Route path="/api/:api_name/:method_name" component={(props) => <Method {...props} />}/>
  </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)

registerServiceWorker();
