import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import OperationParameters from "../elements/OperationParameters";

import JSONPretty from 'react-json-pretty';
import ApiMethodCss from "./ApiMethod.css";
import Header from "../elements/Header";
import queryString from "query-string";
//import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {getDesc, setLang, getLang} from "../utils/helpers";


class Operation extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {result : null, error:false, executing:false};
      
      this.onExecute = this.onExecute.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onBlockchainChange = this.onBlockchainChange.bind(this);
      this.onSelectLang = this.onSelectLang.bind(this);
  }  
    
    onSelectLang(countryCode) {
    
        countryCode = countryCode.toLowerCase();
        switch(countryCode) {
            case "gb":
                countryCode = "en";
                break;
        }
        setLang(countryCode);
        //console.log("countryCode = ", countryCode);
        this.setState({lang:countryCode});
    }
    
    onExecute(event) {
        if(event) {
            event.preventDefault();
        }
        let opName = this.props.match.params.op_name;
        let op = this.steemapi.operations[opName];
            
        let params = [this.state.pkey];
        if(op.params) {
            for(let pname of op.paramNames) {
                if(op.params[pname].type == "Array") {
                    let value = [];
                    for(let i = 0; i < 5; i++) {
                        let pname_f = pname + "_" + i;
                        if(this.state[pname_f]) {
                            value.push(this.state[pname_f]);
                        }
                    }
                    params.push(value);
                } else if(op.params[pname].type == "Object") {
                    let value = this.state[pname];
                    try {
                        value = JSON.parse(value);
                        if(typeof value != "object") {
                            this.setState({result : {steemjsgui: "value is not an object!", parameter : pname}});
                            return;
                        }
                        params.push(value);
                    } catch(e) {
                        this.setState({result : {steemjsgui: e, parameter : pname}});
                        return;
                    }
                } else {
                    params.push(this.state[pname]);
                }
            }
        }
        console.log("op", op);
        console.log("state", this.state);
        console.log("params", params);
        op.execute.apply(op, params).then(
            result => {
                if(!result) {
                    result = {steemjsgui: "empty result from blockchain"};
                }
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
        this.setState({
          [name]: value
        });
    }

    onBlockchainChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
          blockchain: value
        });
        this.onExecute();
    }

    componentDidMount () {
      window.scrollTo(0, 0)
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
    
    let opName = this.props.match.params.op_name;
    let op = this.steemapi.operations[opName];
    
    document.title = "Steem-JS Operation - " + opName;
    
    
    let result = "";
    if(this.state.result) {
        result = <JSONPretty id="json-pretty" json={this.state.result}></JSONPretty>;
    } else if(this.state.executing) {
        result = <img src={"/steemjs02/assets/images/golosa64.gif"}/>;
    }

    if(!this.state.result && !this.state.executing && (!op.params || Object.keys(urlParams).length > 0)) {
        this.onExecute();
    }
    
    let resultClass = this.state.error?"ApiMethod-error":"ApiMethod-result";


    
    return (
    <div className="ApiMethod">
        <form onSubmit={this.onExecute}>
        
            <Header onChange = {this.onBlockchainChange} onSelectLang = {this.onSelectLang} blockchain = {this.state.blockchain}/>
            <div className="ApiMethod-content">
                {/*
                <div className="ApiMethod-links">
                    <Link to={"/broadcast"}>Back to API List</Link>                    
                </div>*/}
                <div className="ApiMethod-header">
                    <h2>{opName}</h2>
                    <div className="ApiMethod-desc">

                        {getDesc(this.steemapi.operations[opName].desc)}
                    </div>
                </div>
                <div className="ApiMethod-key">
                <fieldset className="ApiMethod-fieldset">
                    <legend><h4>Authorization:</h4></legend>
                         <table>
                            {/**<tr>
                                <td className="Parameter-name">Account:</td>
                                <td><input name="userid" onChange={this.onChange} /></td>
                            </tr>*/}
                            <tr>
                                <td className="Parameter-name">Key ({op.roles.join(", ")}):</td>
                                <td><input type="password" name="pkey" onChange={this.onChange} size="55"/></td>
                            </tr>
                        </table>
                </fieldset>
                </div>
                <div className="ApiMethod-params">
                <fieldset className="ApiMethod-fieldset">
                <legend><h4>Parameters:</h4></legend>
                    
                    <OperationParameters op = {op} onChange={this.onChange} paramValues = {this.state}/>
                </fieldset>
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

export default Operation;
