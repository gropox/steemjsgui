import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import OperationParameter from './OperationParameter'

class OperationParameters extends Component {
    
  constructor() {
      super();
  }  
    
  render() {
    
    let op = this.props.op;
    let urlParams = this.props.urlParams;
    
    if(op.params) {
        const opParamerItems = op.paramNames.map((parameterName) =>
            <OperationParameter param={op.params[parameterName]} onChange={this.props.onChange} urlParams = {urlParams} paramValues = {this.props.paramValues}/>
        );
        
        return (
        <div>
            <table>
                {opParamerItems}
            </table>
        </div>
        );
    } else {
        return (<div/>);
    }
  }
}

export default OperationParameters;
