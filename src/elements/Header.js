import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import "./Header.css";
import 'react-flags-select/css/react-flags-select.css';
import ReactFlagsSelect from "react-flags-select";

import {PageHeader, Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, Glyphicon, FormControl} from "react-bootstrap";

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    flex: {
      flexGrow: 1,
    },
    menuButton: {
        width: "150px",
    },
    ws_input: {
        color: "#fff"
    },
    ws_root: {
        color: "inherit"
    },    
    ws_focused: {

    },
    icon: {
        color: "#fff"
    },

});
  

class Header extends Component {

    constructor(props) {
        super(props);
        this.steemapi = new SteemApi();
        this.state = {
            blockchain: this.props.blockchain,
            ws: this.props.ws,
        };
        this.onChange = this.onChange.bind(this);
        this.onSelectLang = this.onSelectLang.bind(this);

    }

    onSelectLang(countryCode) {
        this.props.onSelectLang(countryCode);
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
            });
        }
    }

    onChangeBlockchain(blockchain) {
        const ws = SteemApi.getDefaults(blockchain).ws;
        this.setState({openBCSelector: null, blockchain, ws});
        if (this.props.onChange) {
            this.props.onChange({
                blockchain, ws,
            });
        }        
    }

    onChangeWs(ws) {
        console.log("ws", ws);
        this.setState({ws});
        if (this.props.onChange) {
            this.props.onChange({
                blockchain: this.state.blockchain,
                ws: ws,
            });
        }        
    }

    render() {
        console.log("props & stats", this.props, this.state);
        const {classes} = this.props;
        console.log("state.blockchain", this.state.blockchain);
        return (
            <Navbar inverse>
                <Navbar.Header>
                    {this.state.blockchain && <Navbar.Brand>
                        <a  href="../"><Glyphicon glyph="triangle-left"/></a>
                    </Navbar.Brand>}

                    <Navbar.Text>
                        {this.props.title}
                    </Navbar.Text>
                    <Navbar.Toggle />
                </Navbar.Header>
  
                {this.state.blockchain && <Navbar.Collapse>
                    <Navbar.Form pullRight style={{marginRight:"5px"}}>
                        <FormGroup>
                        <FormControl onChange={(ev) => this.onChangeBlockchain(ev.target.value)} componentClass="select" placeholder={this.state.blockchain}>
                            {Object.keys(SteemApi.Blockchain).map(node => 
                                <option selected={SteemApi.Blockchain[node] == this.state.blockchain} value={SteemApi.Blockchain[node]}>{SteemApi.Blockchain[node]}</option>
                            )}
                        </FormControl>  
                        </FormGroup>{' '}
                        <FormGroup>
                            <FormControl value={this.state.ws} onChange={(ev) => this.onChangeWs(ev.target.value)}></FormControl>
                        </FormGroup>
                    </Navbar.Form>
                </Navbar.Collapse>}
            </Navbar>
        );
    }
}

export default Header;
