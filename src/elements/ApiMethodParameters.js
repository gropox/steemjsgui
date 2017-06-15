import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Parameter from './Parameter'

class ApiMethodParameters extends Component {
    
  constructor() {
      super();
  }  
    
  render() {
    
    let method = this.props.method;
    let urlParams = this.props.urlParams;
    
    if(method.params) {
        const methodParamerItems = method.paramNames.map((parameterName) =>
            
            <Parameter param={method.params[parameterName]} onChange={this.props.onChange} urlParams = {urlParams} paramValues = {this.props.paramValues}/>
        );
        
        return (
        <div>
            <table>
                {methodParamerItems}
            </table>
        </div>
        );
    } else {
        return (<div/>);
    }
  }
}

export default ApiMethodParameters;
