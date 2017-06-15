import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import ApiMethodParameters from "../elements/ApiMethodParameters";
import JSONPretty from 'react-json-pretty';
import ApiMethodCss from "./ApiMethod.css";
import Header from "../elements/Header";
import queryString from "query-string";
//import { withRouter } from 'react-router';

class ApiMethod extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {};
      this.state.result = null;
      this.state.error = false;
      this.state.executing = false;
      
      
      this.onExecute = this.onExecute.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onBlockchainChange = this.onBlockchainChange.bind(this);
  }  
    
    onExecute(event) {
        console.log("Execute");
        if(event) {
        //    event.preventDefault();
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
        console.log("Execute with params " + JSON.stringify(params));
        
        method.execute.apply(method, params).then(
            result => {
                this.setState({result : result, error : false, executing : false});
            },
            error => {
                this.setState({result : error, error : true, executing : false});
            });
            
        this.setState({result : null, error : false, executing : true});
            
    }
        
    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log("on change " + name + " = " + value );
        this.setState({
          [name]: value
        });
        console.log("state1 = " + JSON.stringify(this.state));
    }

    onBlockchainChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log("blockchain changed = " + value);
        this.setState({
          blockchain: value
        });
        this.onExecute();
    }

  render() {
    let urlParams = queryString.parse(this.props.location.search);
    if(!this.state.gotParameters) {
        Object.assign(this.state, urlParams);
        this.state.gotParameters = true;
        if(this.state.blockchain) {
            SteemApi.setBlockchain(this.state.blockchain);
        }
    }
    
    let methodName = this.props.match.params.method_name;
    let apiName = this.props.match.params.api_name;
    let method = this.steemapi.methods[apiName][methodName];
    
    document.title = "Steem-JS API - " + methodName;
    
    
    let result = "";
    if(this.state.result) {
        result = <JSONPretty id="json-pretty" json={this.state.result}></JSONPretty>;
    } else if(this.state.executing) {
        result = <img src={"/assets/images/golosa64.gif"}/>;
    }

    if(!this.state.result && !this.state.executing && (!method.params || Object.keys(urlParams).length > 0)) {
        this.onExecute();
    }
    
    let resultClass = this.state.error?"ApiMethod-error":"ApiMethod-result";
    
    return (
    <div className="ApiMethod">
        <form onSubmit={this.onExecute}>
        
            <Header onChange = {this.onBlockchainChange} blockchain = {this.state.blockchain}/>
            <div className="ApiMethod-content">
                <div className="ApiMethod-header">
                    <h2>{methodName}</h2>
                    <div className="ApiMethod-desc">
                        {this.steemapi.methods[apiName][methodName].desc.ru}
                    </div>
                </div>
                <div className="ApiMethod-params">
                    <h4>Parameters:</h4>
                    <ApiMethodParameters method = {method} onChange={this.onChange} paramValues = {this.state}/>
                </div>
                <div className="ApiMethod-buttons">
                    <input type="submit" value="Execute" />
                </div>
            </div>
        </form>
        <span>Result</span>
        <div className={resultClass}>
            {result}
        </div>
    </div>
    );
  }
}

export default ApiMethod;
