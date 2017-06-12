import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import Apis from "../elements/Apis";
import Header from "../elements/Header";

class Api extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
  }  
    
  render() {
    
    return (
    <div className="Api-body">
        <Header />
        <h2>Steem API</h2>
        <div className="Api-list"><Apis apis = {this.steemapi.methods}/></div>
        <div className="Api-help"></div>
    </div>
    );
  }
}

export default Api;
