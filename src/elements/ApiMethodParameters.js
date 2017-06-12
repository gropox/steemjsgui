import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Parameter from './Parameter'

class ApiMethodParameters extends Component {
    
  constructor() {
      super();
  }  
    
  render() {
    
    let method = this.props.method;
    
    if(method.params) {
        const methodParamerItems = method.paramNames.map((parameterName) =>
            <Parameter param={method.params[parameterName]} onChange={this.props.onChange} />
        );
        
        return (
        <div>
            {methodParamerItems}
        </div>
        );
    } else {
        return (<div/>);
    }
  }
}

export default ApiMethodParameters;
