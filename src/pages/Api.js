import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import Apis from "../elements/Apis";
import Header from "../elements/Header";
import pck from "golos-js/package.json"
import "./Api.css";

import {Grid, Row, Col} from "react-bootstrap";

class Api extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      
      //this.steemapi.dumpOperations();
  }  
    
  render() {
    document.title = "Steem-JS API";
    return (
    <Grid>
        <Row>
            <Col lg="12">
                <Header title="API" {...this.props} />
            </Col>
        </Row>
        <Row>
        <Col lg="12">
            <h2>Golos API {pck.version}</h2>
            <div className="Api-list"><Apis apis = {this.steemapi.methods}/></div>
            <div className="Api-help"></div>
        </Col>
        </Row>
    </Grid>
    );  
  }
}

export default Api;
