import React, { Component } from 'react';
import types from "../steemjs/api/types.json";
import ParameterCss from "./Parameter.css";
import AuthorityParameter from "./AuthorityParameter.js";
import ObjectParameter from "./ObjectParameter.js";
import PublicKey from "./PublicKey.js";
import {getDesc} from "../utils/helpers";

class OperationParameter extends Component {
    
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
    console.log("Parameter " + param.name + " of type [" + param.getType() + "]");
    switch(param.getType()) {
        case "Object" :
            input = <ObjectParameter paramValues = {paramValues} onChange={this.props.onChange} param = {param} getValue = {getValue}/>;
            break;
        case "authority" :
            input = <AuthorityParameter paramValues = {paramValues} onChange={this.props.onChange} param = {param} getValue = {getValue}/>;
            break;
        case "public_key" :
            input = <PublicKey paramValues = {paramValues} onChange={this.props.onChange} param = {param} />;
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

export default OperationParameter;
