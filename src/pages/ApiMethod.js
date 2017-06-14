import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import ApiMethodParameters from "../elements/ApiMethodParameters";
import JSONPretty from 'react-json-pretty';
import ApiMethodCss from "./ApiMethod.css";
import Header from "../elements/Header";

class ApiMethod extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {result : null};
      
      this.onExecute = this.onExecute.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onBlockchainChange = this.onBlockchainChange.bind(this);
  }  
    
    onExecute(event) {
        if(event) {
            event.preventDefault();
        }
        let methodName = this.props.match.params.method_name;
        let apiName = this.props.match.params.api_name;
        let method = this.steemapi.methods[apiName][methodName];
        let params = [];
        console.log(JSON.stringify(method.params));
        if(method.params) {
            for(let pname of method.paramNames) {
                if(method.params[pname].type == "Array") {
                    let value = [];
                    for(let i = 0; i < 5; i++) {
                        let pname_f = pname + "_" + i;
                        if(this.state[pname_f]) {
                            value.push(this.state[pname_f]);
                        }
                    }
                    params.push(value);
                } else {
                    console.log("add param " + pname + "(" + this.state[pname] + ")");
                    params.push(this.state[pname]);
                }
            }
        }
        console.log(JSON.stringify(params));
        method.execute.apply(method, params).then(
            result => {
                this.setState({result : result});
            },
            error => {
                this.setState({result : error});
            });
    }
        
    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log("on change " + name + " = " + value );
        this.setState({
          [name]: value
        });
        console.log("state = " + JSON.stringify(this.state));
    }

    onBlockchainChange(event) {
        console.log("blockchain changed = " + event.value);
        this.setState({
          [event.name]: event.value
        });
        if(this.state.result) {
            this.onExecute(event);
        }
    }

  render() {
    let methodName = this.props.match.params.method_name;
    let apiName = this.props.match.params.api_name;
    let method = this.steemapi.methods[apiName][methodName];
    
    let result = "";
    if(this.state.result) {
        result = <JSONPretty id="json-pretty" json={this.state.result}></JSONPretty>;
    }

    if(!this.state.result && !method.params) {
        this.onExecute();
    }
    
    
    return (
    <div>
        <form onSubmit={this.onExecute}>
        
            <Header onChange = {this.onBlockchainChange}/>

            <div className="ApiMethod-header">
                <h2>{methodName}</h2>
                <div className="Method-desc">
                    {this.steemapi.methods[apiName][methodName].desc.ru}
                </div>
            </div>
            <div className="ApiMethod-params">
                <h4>Parameters:</h4>
                <ApiMethodParameters method = {method} onChange={this.onChange} />
            </div>
            <div>
                <input type="submit" value="Execute" />
            </div>
        </form>
        <div className="ApiMethod-result">
            {result}
        </div>
    </div>
    );
  }
}

export default ApiMethod;
