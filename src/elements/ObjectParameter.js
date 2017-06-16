import React, { Component } from 'react';

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
        JSON.parse(value);
        if(this.state.error) {
            this.setState({error : null});
        }
        this.props.onChange(event);
    } catch(e) {
        this.setState({error : e.toString()});
    }
  }
  
  render() {
    
    let paramValues = this.props.paramValues;
    let getValue = this.props.getValue;
    
    let param = this.props.param;
    
    let error = null;
    if(this.state.error) {
        error = <div className={"Parameter-error"}>{this.state.error}</div>;
    }
    
    return (<div><textarea name={param.name} rows={25} cols={80} onChange={this.onChange}>{getValue(param.name)}</textarea>
        {error}</div>);
  }
}

export default ObjectParameter;
