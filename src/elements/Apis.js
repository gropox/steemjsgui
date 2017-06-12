import React, { Component } from 'react';
import ApiMethods from "./ApiMethods";

class Apis extends Component {
    
  constructor() {
      super();
  }  
    
  render() {
    
    let apis = Object.keys(this.props.apis);
    apis.sort((a,b) => {
        if(a == b) return 0;
        if(a < b ) return -1;
        return 1;
    });
    
    const apiItems = apis.map((api) =>
        <li>
            <h3>{api}</h3>
            <ApiMethods api = {api} methods = {this.props.apis[api]} />
        </li>
    );
    
    return (
        <ul>
            {apiItems}
        </ul>
    );
  }
}

export default Apis;
