import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import SteemApi from "../steemjs/api";
import types from "../steemjs/api/types.json";

class Parameter extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {count : 1};
  }  
    
  render() {
    
    let param = this.props.param;
    
    let input = <input type="text" name={param.name} onChange={this.props.onChange} />
    console.log(param.type);
    if(param.type == "Array") {
        input = [0,1,2,3,4].map((pIdx) =>
            <div ><input type="text" name={param.name + "_" + pIdx} onChange={this.props.onChange} /></div>
        );
    }    
    return (
    <div>
        <label title={param.desc.ru}>
        {param.name}:&nbsp;
            {input}
        </label>
    </div>
    );
  }
}

export default Parameter;
