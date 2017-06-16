import React, { Component } from 'react';
import types from "../steemjs/api/types.json";
import ParameterCss from "./Parameter.css";
import ArrayParameter from "./ArrayParameter.js";
import ObjectParameter from "./ObjectParameter.js";
import {getDesc} from "../utils/helpers";

class Parameter extends Component {
    
  constructor() {
      super();
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

    let input = null;
    switch(param.type) {
        case "Array" :
            input = <ArrayParameter paramValues = {paramValues} onChange={this.props.onChange} param = {param} getValue = {getValue}/>;
            break;
        case "Object" :
            input = <ObjectParameter paramValues = {paramValues} onChange={this.props.onChange} param = {param} getValue = {getValue}/>;
            break;
        default:
            input = <input type="text" name={param.name} onChange={this.props.onChange} value = {getValue(param.name)}/>;
    }
          
    return (
    <tr>
        <td title={getDesc(param.desc)} className="Parameter-name">
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
