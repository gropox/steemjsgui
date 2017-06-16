import React, { Component } from 'react';

class ArrayParameter extends Component {
    
  constructor() {
      super();
  }  
    
  render() {
    
    let paramValues = this.props.paramValues;
    let getValue = this.props.getValue;
    
    let param = this.props.param;
    let inputs = [0,1,2].map((pIdx) =>
                <div><input type="text" name={param.name + "_" + pIdx} onChange={this.props.onChange} value = {getValue(param.name + "_" + pIdx)}/></div>);

    return (<div>{inputs}</div>);
  }
}

export default ArrayParameter;
