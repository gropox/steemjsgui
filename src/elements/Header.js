import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import HeaderCss from "./Header.css";
import {getDesc, setLang, getLang} from "../utils/helpers";
import 'react-flags-select/css/react-flags-select.css';
import ReactFlagsSelect from "react-flags-select";
class Header extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {blockchain: null};
      this.onChange = this.onChange.bind(this);
      this.onSelectLang = this.onSelectLang.bind(this);
  }  
    
    onSelectLang(countryCode) {
        this.props.onSelectLang(countryCode);
    }
    
    getBigLang() {
        let lang = getLang();
        switch(lang) {
            case "en":
                lang = "gb";
                break;
        }        
        return lang.toUpperCase();
    }    
    onChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
          blockchain: value
        });
        SteemApi.setBlockchain(value);
        if(this.props.onChange) {
            this.props.onChange(event);
        }
    }
    
  render() {
    if(!this.state.blockchain) {
        this.state.blockchain = this.props.blockchain;
    }
    if(!this.state.blockchain) {
        this.state.blockchain = SteemApi.getBlockchain();
    }
    
    const languageSelector = <ReactFlagsSelect defaultCountry={this.getBigLang()}  
        countries={["GB", "RU", "DE", "ES"]} 
        showSelectedLabel={true}
        customLabels={{"GB": "en","RU": "ru","DE": "de","ES": "es"}} 
        onSelect={this.onSelectLang}
        />
            
    return (
    <div className="Header-body">
        <div className="Header-title">Steem-js GUI</div>
        <div className="Header-authors">Authors: <a href="https://golos.io/@ropox">@ropox</a>, <a href="https://golos.io/@asuleymanov">@asuleymanov</a>
        </div>
                        <div>
                            {languageSelector}
                        </div>
        <div className="Header-selector">
            <label>{'\u00A0'}Steemit: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.STEEMIT} checked={this.state.blockchain == SteemApi.Blockchain.STEEMIT} /></label>
            <label>{'\u00A0'}Golos: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.GOLOS} checked={this.state.blockchain == SteemApi.Blockchain.GOLOS} /></label>
            {'\u00A0'}<label>Golos Testnet: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.GOLOSTEST} checked={this.state.blockchain == SteemApi.Blockchain.GOLOSTEST} /></label>
        </div>
    </div>
    );
  }
}

export default Header;
