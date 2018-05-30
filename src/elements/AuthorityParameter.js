import React, { Component } from 'react';
import AccountAuths from "./AccountAuths.js";
import KeyAuths from "./KeyAuths.js";

class AuthorityParameter extends Component {

    constructor() {
        super();
        this.state = {composed : {
                weight_threshold: 1, 
                account_auths: [], 
                key_auths: []
            },
            account_auths : 0,
            key_auths : 1,
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
        
        console.log("ap", name, JSON.stringify(value));

        this.props.onChange({target:{
            name : this.props.param.name,
            value : {
                weight_threshold : parseInt(this.state.weight_threshold),
                account_auths : this.state.account_auths,
                key_auths : this.state.account_auths
            }
        }});

    }

    render() {

        let param = this.props.param;

        return (<div>
            <div>
                <table>
                    <tr>
                        <td className="Parameter-name">Weight threshold</td>
                        <td><input type="number" name={"weight_threshold"} onChange={this.onChange} size="3" min="0" max="99" value="1" /></td>
                    </tr>
                    <tr>
                        <td className="Parameter-name" colspan="1">Account auths</td>
                        <td valign="top">
                            <AccountAuths onChange={this.onChange} param = {"account_auths"} />
                        </td>
                    </tr>
                    <tr>
                        <td className="Parameter-name" colspan="1">Key auths</td>
                        <td valign="top">
                            <KeyAuths onChange={this.onChange} param = {"key_auths"} />
                        </td>
                    </tr>
                </table>
            </div>
        </div>);
    }
}

export default AuthorityParameter;
