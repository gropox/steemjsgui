import React, { Component } from 'react';
import PublicKey from './PublicKey.js'

class KeyAuths extends Component {

    constructor() {
        super();
        this.state = {
            public_key : "",
            weight_threshold : 1,
            error:false, 
            executing:false};
        this.onChange = this.onChange.bind(this);
    }


    onChange(event) {
        //param.name

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
        console.log("aa", name, JSON.stringify(value));
        
        let new_name = this.props.param;
        let new_value = [[this.state.public_key, parseInt(this.state.weight_threshold)]];

        //console.log("aa", "event", JSON.stringify(event));
        this.props.onChange({target:{name:new_name,value:new_value}});
    }

    render() {

        return (
            <div>
                <PublicKey onChange={this.onChange} />
                <input type="number" name={"weight_threshold"} onChange={this.onChange} size="3" min="0" max="99" value="1" />
            </div>);
    }
}

export default KeyAuths;
