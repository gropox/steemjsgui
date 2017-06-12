import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import Api from './pages/Api';
import Broadcast from './pages/Broadcast';
import Method from './pages/ApiMethod';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Router, Route, BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
  <div>
      <Route exact path="/steemjs/" component={Api} />
      <Route exact path="/steemjs/api" component={Api}/>
      <Route path="/steemjs/api/:api_name/:method_name" component={Method}/>
      <Route exact path="/steemjs/broadcast" component={Broadcast}/>
  </div>
  </BrowserRouter>,
  document.getElementById('root')
)

registerServiceWorker();
