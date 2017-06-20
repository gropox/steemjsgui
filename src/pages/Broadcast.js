import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import Operations from "../elements/Operations";
import Header from "../elements/Header";
import ApiCss from "./Api.css";

class Broadcast extends Component {
    
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
            <div className="Api-list"><Operations operations = {this.steemapi.operations}/></div>
            <div className="Api-help"></div>
        </div>
    </div>
    );  
  }
}

export default Broadcast;
