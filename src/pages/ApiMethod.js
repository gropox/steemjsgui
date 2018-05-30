import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import ApiMethodParameters from "../elements/ApiMethodParameters";

import JSONPretty from 'react-json-pretty';
import ApiMethodCss from "./ApiMethod.css";
import Header from "../elements/Header";
import queryString from "query-string";
//import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getDesc, setLang, getLang } from "../utils/helpers";


class ApiMethod extends Component {

    constructor(params) {
        super(params);
        this.steemapi = new SteemApi();
        this.state = {
            result: null,
            error: false,
            executing: false,
            blockchain: SteemApi.Blockchain.GOLOS,
            ws: null,
            prefix: null,
            chain_id: null,
            gotParams: false
        };

        this.onExecute = this.onExecute.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlockchainChange = this.onBlockchainChange.bind(this);
        this.onSelectLang = this.onSelectLang.bind(this);

        this.applyParameters();
    }

    applyParameters() {
        let urlParams = queryString.parse(this.props.location.search);
        this.state.gotParams = Object.keys(urlParams).length > 0;
        Object.assign(this.state, urlParams);
        if (!this.state.ws || !this.state.prefix || !this.state.chain_id) {
            if (!Object.keys(SteemApi.Blockchain).includes(this.state.blockchain)) {
                this.state.blockchain = SteemApi.Blockchain.GOLOS;
            }
            const defaults = SteemApi.getDefaults(this.state.blockchain);
            Object.assign(this.state, defaults);
        }
    }

    onSelectLang(countryCode) {

        countryCode = countryCode.toLowerCase();
        switch (countryCode) {
            case "gb":
                countryCode = "en";
                break;
        }
        setLang(countryCode);
        //console.log("countryCode = ", countryCode);
        this.setState({ lang: countryCode });
    }

    onExecute(event) {
        if (event) {
            //    event.preventDefault();
        }
        SteemApi.setBlockchain(this.state.ws, this.state.prefix, this.state.chain_id);
        
        let methodName = this.props.match.params.method_name;
        let apiName = this.props.match.params.api_name;
        let method = this.steemapi.methods[apiName][methodName];
        let params = [];
        if (method.params) {
            for (let pname of method.paramNames) {
                if (method.params[pname].type == "Array") {
                    let value = [];
                    for (let i = 0; i < 5; i++) {
                        let pname_f = pname + "_" + i;
                        if (this.state[pname_f]) {
                            value.push(this.state[pname_f]);
                        }
                    }
                    params.push(value);
                } else if (method.params[pname].type == "Object") {
                    let value = this.state[pname];
                    try {
                        value = JSON.parse(value);
                        if (typeof value != "object") {
                            this.setState({ result: { steemjsgui: "value is not an object!", parameter: pname } });
                            return;
                        }
                        params.push(value);
                    } catch (e) {
                        this.setState({ result: { steemjsgui: e, parameter: pname } });
                        return;
                    }
                } else {
                    params.push(this.state[pname]);
                }
            }
        }

        method.execute.apply(method, params).then(
            result => {
                if (!result) {
                    result = { steemjsgui: "empty result from blockchain" };
                }
                this.setState({ result: result, error: false, executing: false });
            },
            error => {
                this.setState({ result: error, error: true, executing: false });
            });

        this.setState({ result: null, error: false, executing: true });

    }

    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    onBlockchainChange(values) {
        this.setState(values);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {

        let methodName = this.props.match.params.method_name;
        let apiName = this.props.match.params.api_name;
        let method = this.steemapi.methods[apiName][methodName];

        document.title = "Steem-JS API - " + methodName;

        let result = "";
        if (this.state.result) {
            result = <JSONPretty id="json-pretty" json={this.state.result}></JSONPretty>;
        } else if (this.state.executing) {
            result = <img src={"/steemjs02/assets/images/golosa64.gif"} />;
        }

        if (!this.state.result && !this.state.executing && (!method.params || this.state.gotParams)) {
            this.onExecute();
        }

        let resultClass = this.state.error ? "ApiMethod-error" : "ApiMethod-result";

        return (
            <div className="ApiMethod">
                <form onSubmit={this.onExecute}>

                    <Header onChange={this.onBlockchainChange}
                        onSelectLang={this.onSelectLang}
                        blockchain={this.state.blockchain}
                        ws={this.state.ws}
                        prefix={this.state.prefix}
                        chain_id={this.state.chain_id} />

                    <div className="ApiMethod-content">
                        <div className="ApiMethod-links">
                            <Link to={"/api"}>Back to API List</Link>
                        </div>
                        <div className="ApiMethod-header">
                            <h2>{methodName}</h2>
                            <div className="ApiMethod-desc">

                                {getDesc(this.steemapi.methods[apiName][methodName].desc)}
                            </div>
                        </div>
                        <div className="ApiMethod-params">
                            <h4>Parameters:</h4>
                            <ApiMethodParameters method={method} onChange={this.onChange} paramValues={this.state} />
                        </div>
                        <div className="ApiMethod-buttons">
                            <input className="ApiMethod-button  " type="submit" value="Execute" />
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
