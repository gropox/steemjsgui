import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import Apis from "../elements/Apis";
import Header from "../elements/Header";
import ApiCss from "./Api.css";

class Api extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      
      //this.steemapi.dumpOperations();
  }  
    
  render() {
    document.title = "Steem-JS API";
    return (
    <div className="Api-body">
        <Header />
        <div className="Api-content">
            <h2>Steem API</h2>
            <div className="Api-list"><Apis apis = {this.steemapi.methods}/></div>
            <div className="Api-help"></div>
        </div>
    </div>
    );  
  }
}

export default Api;
