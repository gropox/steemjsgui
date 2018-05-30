import React, { Component } from 'react';

class PublicKey extends Component {

    constructor() {
        super();
        this.state = {
            public_key : "",
            weight_threshold : 1,
            error:false, 
            executing:false};
    }

    render() {

        return (
            <div>
                <input type="text" name={"public_key"} onChange={this.props.onChange} size="52" />
            </div>);
    }
}

export default PublicKey;
