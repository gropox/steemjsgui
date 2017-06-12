import React, { Component } from 'react';
import SteemApi from "../steemjs/api";

class Header extends Component {
    
  constructor() {
      super();
      this.steemapi = new SteemApi();
      this.state = {blockchain: SteemApi.getBlockchain()};
      this.onChange = this.onChange.bind(this);
  }  
    
    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log("on change " + name + " = " + value );
        this.setState({
          blockchain: value
        });
        SteemApi.setBlockchain(value);
        if(this.props.onChange) {
            this.props.onChange(event);
        }
    }
    
  render() {
    console.log("state = " + JSON.stringify(this.state));
    
    return (
    <div className="Header-body">
        <div className="Header-about">Steem-js GUI, created by @ropox</div>
        <div className="Header-selector">
            <label>Steemit: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.STEEMIT} checked={this.state.blockchain == SteemApi.Blockchain.STEEMIT} /></label>
            <label>Golos: <input type="radio" name="blockchain" onChange={this.onChange} value={SteemApi.Blockchain.GOLOS} checked={this.state.blockchain == SteemApi.Blockchain.GOLOS} /></label>
        </div>
    </div>
    );
  }
}

export default Header;
