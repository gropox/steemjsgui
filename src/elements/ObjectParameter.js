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
    }
});
class ObjectParameter extends Component {
    
  constructor() {
      super();
      this.state = {error:null};
      this.onChange = this.onChange.bind(this);
  }  
    
  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;      
    
    try {
        this.props.onChange(event);
        JSON.parse(value);
        if(this.state.error) {
            this.setState({error : null});
        }
    } catch(e) {
        this.setState({error : e.toString()});
    }
  }
  
  render() {
    
    let paramValues = this.props.paramValues;
    let getValue = this.props.getValue;
    
    let {classes, param} = this.props;
    
    let error = null;
    if(this.state.error) {
        error = <div className={"Parameter-error"}>{this.state.error}</div>;
    }
    
    return (<div><TextField 
                    multiline={true} 
                    name={param.name} 
                    placeholder={param.default}
                    label={param.disp_name} 
                    className={classes.textField}
                    maxRows={5} 
                    onChange={this.onChange} 
                    value={getValue(param.name)}></TextField>
        {error}</div>);
  }
}

export default withStyles(styles)(ObjectParameter);
