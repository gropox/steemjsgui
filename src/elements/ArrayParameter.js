import React, { Component } from 'react';
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
      width: 500
    },
    menu: {
      width: 500,
    },
});

class ArrayParameter extends Component {
    
  constructor() {
      super();
  }  
    
  render() {
    
    let paramValues = this.props.paramValues;
    let getValue = this.props.getValue;
    
    const { classes, param } = this.props;

    let inputs = [0,1,2].map((pIdx) =>
                <div key={pIdx}>
                    <TextField 
                        type="text" 
                        name={param.name + "_" + pIdx} 
                        label={param.name + " " + pIdx}
                        onChange={this.props.onChange} 
                        className={classes.textField}
                        value = {getValue(param.name + "_" + pIdx)}/></div>);

    return (<div>{inputs}</div>);
  }
}

export default withStyles(styles)(ArrayParameter);
