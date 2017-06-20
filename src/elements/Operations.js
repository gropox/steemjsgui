import React, { Component } from 'react';
import { Link } from 'react-router-dom'
class Operations extends Component {

  constructor() {
      super();
  }  
    
    getTarget(operation) {
        return "/broadcast/" + operation;
    }
        
  render() {
    
    let operations = Object.keys(this.props.operations);
    operations.sort((a,b) => {
        if(a == b) return 0;
        if(a < b ) return -1;
        return 1;
    });
    
    const apiItems = operations.map((op) =>
        <li><Link to={this.getTarget(op)}>{op}</Link></li>
    );
    
    return (
        <ul>
            {apiItems}
        </ul>
    );
  }
}

export default Operations;
