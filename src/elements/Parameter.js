import React, { Component } from 'react';
import types from "../steemjs/api/types.json";
import ParameterCss from "./Parameter.css";
import ArrayParameter from "./ArrayParameter.js";
import ObjectParameter from "./ObjectParameter.js";
import {getDesc} from "../utils/helpers";
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
});

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
        return "";
    }
    
    const { classes, param } = this.props;

    let input = null;
    console.log("Parameter " + param.name + " of type [" + param.type + "]");
    switch(param.type) {
        case "Array" :
            input = <ArrayParameter paramValues = {paramValues} onChange={this.props.onChange} param = {param} getValue = {getValue}/>;
            break;
        case "Object" :
            input = <ObjectParameter paramValues = {paramValues} onChange={this.props.onChange} param = {param} getValue = {getValue}/>;
            break;
        default:
            input = <TextField label={param.disp_name} 
                                placeholder={param.default} 
                                type="text" 
                                name={param.name} 
                                className={classes.textField}
                                onChange={this.props.onChange} 
                                value = {getValue(param.name)}/>;
    }
          
    return (<div>{input}</div>
            
    );
  }
}

export default withStyles(styles)(Parameter);
