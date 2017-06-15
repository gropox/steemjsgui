import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import SteemApi from "../steemjs/api";
import types from "../steemjs/api/types.json";
import ParameterCss from "./Parameter.css";

class Parameter extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {count : 1};
  }  
    
  render() {
    let paramValues = this.props.paramValues;
    function getValue(name) {
        if(paramValues[name] && paramValues[name] != "") {
            return paramValues[name];
        }
        return null;
    }
    
    let param = this.props.param;

    let input = <input type="text" name={param.name} onChange={this.props.onChange} value = {getValue(param.name)}/>
    console.log(param.type);
    if(param.type == "Array") {
        input = [0,1,2].map((pIdx) =>
            <div><input type="text" name={param.name + "_" + pIdx} onChange={this.props.onChange} value = {getValue(param.name + "_" + pIdx)}/></div>
        );
    }    
    return (
    <tr>
        <td title={param.desc.ru} className="Parameter-name">
        {param.name}:&nbsp;
        </td>
        <td>
            {input}
        </td>
    </tr>
    );
  }
}

export default Parameter;
