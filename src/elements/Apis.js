import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from 'react-router-dom'

import "./Apis.css"

class Apis extends Component {

    constructor() {
        super();
    }
    getTarget(api, method) {
        return "/api/" + api + "/" + method;
    }

    render() {

        let apis = Object.keys(this.props.apis);
        apis.sort((a, b) => {
            if (a == b) return 0;
            if (a < b) return -1;
            return 1;
        });

        const apiItems = apis.map((api) => {
            let ret = [
                <ListGroupItem style={{border:"0px"}} header={api} />]
            const methods = this.props.apis[api];
            let methodNames = Object.keys(methods);
            methodNames.sort((a, b) => {
                if (a == b) return 0;
                if (a < b) return -1;
                return 1;
            });

            methodNames.map(name => {
                ret.push(<ListGroupItem bsClass="method-selector"><Link to={this.getTarget(api, name)}>{name}</Link></ListGroupItem>)
            });
            return ret;
        });

        return (
            <ListGroup>
                {apiItems}
            </ListGroup>
        );
    }
}

export default Apis;
