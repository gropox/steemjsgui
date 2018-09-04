import React, { Component } from 'react';
import SteemApi from "../steemjs/api";
import "./Header.css";
import 'react-flags-select/css/react-flags-select.css';
import ReactFlagsSelect from "react-flags-select";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -18,
      marginRight: 10,
    },
  };
  

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

    render() {
        console.log("props & stats", this.props, this.state);
        const {classes} = this.props;
        console.log("state.blockchain", this.state.blockchain);
        return (
            <AppBar position="static">
                <Toolbar variant="dense">
                <Typography variant="title" color="inherit">
                    {this.props.title}
                </Typography>
                </Toolbar>                
            </AppBar>
        );
    }
}

export default withStyles(styles)(Header);
