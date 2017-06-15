import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import HeaderCss from "./Header.css";

class Header extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {blockchain: null};
      this.onChange = this.onChange.bind(this);
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
    return (
    <div className="Header-body">
        <div className="Header-title">Steem-js GUI</div>
        <div className="Header-authors">Authors: <a href="https://golos.io/@ropox">@ropox</a>, <a href="https://golos.io/@asuleymanov">@asuleymanov</a>
        </div>
        <div className="Header-selector">
            <label>Steemit: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.STEEMIT} checked={this.state.blockchain == SteemApi.Blockchain.STEEMIT} /></label>
            <label>Golos: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.GOLOS} checked={this.state.blockchain == SteemApi.Blockchain.GOLOS} /></label>
        </div>
    </div>
    );
  }
}

export default Header;
