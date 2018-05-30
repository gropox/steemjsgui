import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import HeaderCss from "./Header.css";
import { getDesc, setLang, getLang } from "../utils/helpers";
import 'react-flags-select/css/react-flags-select.css';
import ReactFlagsSelect from "react-flags-select";
import { Link } from 'react-router-dom';
import { Box, VBox } from 'react-layout-components';

class Header extends Component {

    constructor(props) {
        super(props);
        this.steemapi = new SteemApi();
        this.state = {
            blockchain: this.props.blockchain,
            ws: this.props.ws,
            prefix: this.props.prefix,
            chain_id: this.props.chain_id
        };
        this.onChange = this.onChange.bind(this);
        this.onSelectLang = this.onSelectLang.bind(this);

    }

    onSelectLang(countryCode) {
        this.props.onSelectLang(countryCode);
    }

    getBigLang() {
        let lang = getLang();
        switch (lang) {
            case "en":
                lang = "gb";
                break;
        }
        return lang.toUpperCase();
    }

    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name, value);
        let newState = {
            [name]: value
        }
        if (name == "blockchain") {
            const defaults = SteemApi.getDefaults(value);
            console.log("got defaults", defaults);
            Object.assign(newState, defaults);
        }

        this.setState(newState);

        if (this.props.onChange) {
            this.props.onChange({
                blockchain: this.state.blockchain,
                ws: this.state.ws,
                prefix: this.state.prefix,
                chain_id: this.state.chain_id
            });
        }
    }

    render() {
        console.log(this.props, this.state);

        const languageSelector = <ReactFlagsSelect defaultCountry={this.getBigLang()}
            countries={["GB", "RU", "DE", "ES"]}
            showSelectedLabel={true}
            customLabels={{ "GB": "en", "RU": "ru", "DE": "de", "ES": "es" }}
            onSelect={this.onSelectLang}
        />
        console.log("state.blockchain", this.state.blockchain);
        const bcSelectorOptions = Object.keys(SteemApi.Blockchain).map(value =>
            <option value={SteemApi.Blockchain[value]} selected={SteemApi.Blockchain[value] == this.state.blockchain}>{SteemApi.Blockchain[value]}</option>
        );

        let hiddenParams = (this.state.blockchain != SteemApi.Blockchain.GOLOSTestnet) ?
            <div>
                <input type="hidden" value={this.state.ws} name="ws" />
                <input type="hidden" value={this.state.prefix} name="prefix" />
                <input type="hidden" value={this.state.chain_id} name="chain_id" />
            </div> : null;
        return (
            <VBox className="Header-body">
                <VBox className="Header-selector">
                    <VBox>
                        <table>
                            <tr>
                                <td>Node</td>
                                <td>
                                    <select name="blockchain" onChange={this.onChange} >
                                        {bcSelectorOptions}
                                    </select>
                                    {hiddenParams}
                                </td>
                            </tr>
                            <tr>
                                <td>WS</td><td><input type="text" name="ws" onChange={this.onChange}
                                    value={this.state.ws}
                                    size="25"
                                    disabled={this.state.blockchain != SteemApi.Blockchain.GOLOSTestnet}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td>Prefix</td><td><input type="text" name="prefix" onChange={this.onChange}
                                    value={this.state.prefix}
                                    size="4"
                                    disabled={this.state.blockchain != SteemApi.Blockchain.GOLOSTestnet}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td>ChainId</td><td><input type="text" name="chain_id" onChange={this.onChange}
                                    value={this.state.chain_id}
                                    size="60"
                                    disabled={this.state.blockchain != SteemApi.Blockchain.GOLOSTestnet}
                                />
                                </td>
                            </tr>
                        </table>

                    </VBox>
                </VBox>

                <Box className="Header-title">Steem-js GUI</Box>
                <Box className="Header-authors">Authors: <a href="https://golos.io/@ropox">@ropox</a>, <a href="https://golos.io/@asuleymanov">@asuleymanov</a>
                </Box>
                <Box>
                    {languageSelector}
                </Box>
            </VBox >

        );
    }
}

export default Header;
