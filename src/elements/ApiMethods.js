import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class ApiMethods extends Component {
    
  constructor() {
      super();
  }  
    
    getTarget(api, method) {
        return "/api/"+api + "/" + method;
    }
    
  render() {
    
    let methods = Object.keys(this.props.methods);
    methods.sort((a,b) => {
        if(a == b) return 0;
        if(a < b ) return -1;
        return 1;
    });
    
    const methodItems = methods.map((methodName) =>
        <li><Link to={this.getTarget(this.props.api, methodName)}>{methodName}</Link></li>
    );
    
    return (
        <ul>
            {methodItems}
        </ul>
    );
  }
}

export default ApiMethods;
