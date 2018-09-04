import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import Apis from "../elements/Apis";
import Header from "../elements/Header";
import pck from "golos-js/package.json"
import "./Api.css";

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
        <Header title="API" {...this.props} />
        <div className="Api-content">
            <h2>Golos API {pck.version}</h2>
            <div className="Api-list"><Apis apis = {this.steemapi.methods}/></div>
            <div className="Api-help"></div>
        </div>
    </div>
    );  
  }
}

export default Api;
