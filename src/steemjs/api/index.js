import steem from "viz-world-js"
import methods from 'viz-world-js/lib/api/methods'
import operations from 'viz-world-js/lib/broadcast/operations'
import steemoperations from 'viz-world-js/lib/auth/serializer/src/operations'
import typeDefs from 'viz-world-js/lib/auth/serializer/src/types'
import { camelCase } from 'viz-world-js/lib/utils';
import types from "./types";
import optypes from "./optypes";
//console.log("steem_operations", steemoperations);


class OpParam {
    constructor(op, name) {
        this.op = op;
        this.name = name;

        this.type = "String";
        this.desc = { en: "", ru: "", de: "", es: "" };

        if (optypes[op]
            && optypes[op].params
            && optypes[op].params[name]) {
            let meta = optypes[op].params[name];
            if (meta.type) {
                this.type = meta.type;
            }
            if (meta.desc) {
                for (let tr of Object.keys(meta.desc)) {
                    this.desc[tr] = meta.desc[tr];
                }
            }
        }
    }

    getType() {
        return this.getTypeDef(this.getTypeObject());
    }

    convertTyped(val) {
        let type = this.getType();
        //console.log("1perameter " + this.name + " has type ", type);
        let ret = val;
        switch (type) {
            case "uint16":
            case "uint32":
            case "uint64":
            case "int16":
                ret = parseInt(val);
                if (isNaN(ret)) {
                    throw this.name + " is not a number [" + val + "]";
                }
                break;
            case "asset":
                //check
                if (! /^[0-9]+\.?[0-9]* [A-Za-z0-9]+$/.test(ret)) {
                    throw this.name + ": Expecting amount like '99.000 SYMBOL', instead got '" + val + "'";
                }
                break;
            case "public_key":
                const prefix = steem.config.get('address_prefix');
                if (!ret.match("^" + prefix + ".*$")) {
                    throw this.name + ": Public key has to start with " + prefix + " instead got '" + val + "'";
                }
                break;
        }
        return ret;
    }



    getTypeDef(type) {
        //console.log("getTypeDef of " + JSON.stringify(type));
        if (typeof type.operation_name != "undefined") {
            return type.operation_name;
        }
        for (let td of Object.keys(typeDefs)) {
            if (typeDefs[td] == type) {
                return td;
            }
        }
        return "unknown";
    }

    getTypeObject() {
        let opSer = steemoperations[this.op];
        return opSer.types[this.name];
    }
}


class Param {
    constructor(api, method, name) {
        this.api = api;
        this.method = method;
        const [disp_name, pdefault] = name.split("=");

        this.name = name;
        this.disp_name = disp_name;
        this.default = pdefault;

        this.type = "String";
        this.desc = { en: "", ru: "", de: "", es: "" };
        if (types[api]
            && types[api][method]
            && types[api][method].params
            && types[api][method].params[this.name]) {
            let meta = types[api][method].params[this.name];
            //console.log("meta",meta);
            if (meta.type) {
                this.type = meta.type;
            }
            if (meta.desc) {
                for (let tr of Object.keys(meta.desc)) {
                    this.desc[tr] = meta.desc[tr];
                }
            }
        }
    }
}

class Operation {

    constructor(name, params, roles) {
        this.name = name;
        this.paramNames = params;
        this.params = null;
        this.roles = roles;
        if (params && params.length > 0) {
            this.params = {};
            for (let p of params) {
                this.params[p] = new OpParam(name, p);
            }
        }
        this.desc = { en: "", ru: "", de: "", es: "" };
        if (optypes[name]
            && optypes[name].desc) {
            for (let tr of Object.keys(optypes[name].desc)) {
                this.desc[tr] = optypes[name].desc[tr];
            }
        }
    }

    convert(args) {
        for (let i = 0; i < this.paramNames.length; i++) {
            let pname = this.paramNames[i];
            args[i] = this.params[pname].convertTyped(args[i]);
        }

    }

    execute() {
        var camelName = camelCase(this.name);
        var params = [arguments[0]];
        var args = Array.prototype.splice.call(arguments, 1);
        this.convert(args);
        params = params.concat(args);
        console.log("Execute " + camelName + "Async(" + JSON.stringify(params) + ")");
        return steem.broadcast[camelName + "Async"].apply(steem.broadcast, params);
        //return steem.api.getDynamicGlobalPropertiesAsync();
    }
}



class Method {

    constructor(api, name, params) {
        this.api = api;
        this.name = name;
        this.paramNames = params;
        this.params = null;
        if (params && params.length > 0) {
            this.params = {};
            for (let p of params) {
                this.params[p] = new Param(api, name, p);
            }
        }
        this.desc = { en: "", ru: "", de: "", es: "" };
        if (types[api]
            && types[api][name]
            && types[api][name].desc) {
            for (let tr of Object.keys(types[api][name].desc)) {
                this.desc[tr] = types[api][name].desc[tr];
            }
        }
    }

    execute() {
        var camelName = camelCase(this.name);
        var args = Array.prototype.splice.call(arguments, 0);
        //console.log("Execute " + camelName + "Async(" + JSON.stringify(args) + ")" );
        return steem.api[camelName + "Async"].apply(steem.api, args);
        //return steem.api.getDynamicGlobalPropertiesAsync();
    }
}

class SteemApi {

    constructor() {

        this.methods = {};
        this.operations = {};
        this.importMethods();
        this.importOperations();
    }

    importMethods() {
        for (let m of methods) {
            if (!this.methods[m.api]) {
                this.methods[m.api] = {};
            }
            this.methods[m.api][m.method] = new Method(m.api, m.method, m.params);
        }
    }

    importOperations() {
        for (let op of operations) {
            this.operations[op.operation] = new Operation(op.operation, op.params, op.roles);
        }
    }

    dumpMethods() {
        let dump = {};
        for (let api of Object.keys(this.methods)) {
            if (!dump[api]) {
                dump[api] = {};
            }
            for (let mname of Object.keys(this.methods[api])) {
                let m = this.methods[api][mname];
                let mdump = { desc: { en: "", ru: "", de: "", es: "" } };
                if (m.params) {
                    mdump.params = {};
                    for (let pname of Object.keys(m.params)) {
                        let p = m.params[pname];
                        mdump.params[p.name] = {
                            type: p.type,
                            desc: { en: "", ru: "", de: "", es: "" }
                        }
                        for (let tr of Object.keys(p.desc)) {
                            mdump.params[p.name].desc[tr] = p.desc[tr];
                        }
                    }
                    for (let tr of Object.keys(m.desc)) {
                        mdump.desc[tr] = m.desc[tr];
                    }
                }
                dump[m.api][m.name] = mdump;
            }
        }
    }

    dumpOperations() {
        let dump = {};
        for (let opName of Object.keys(this.operations)) {
            let op = this.operations[opName];
            let opdump = { desc: { en: "", ru: "", de: "", es: "" } };
            if (op.params) {
                opdump.params = {};
                for (let pname of Object.keys(op.params)) {
                    let p = op.params[pname];
                    opdump.params[p.name] = {
                        type: p.type,
                        desc: { en: "", ru: "", de: "", es: "" }
                    }
                    for (let tr of Object.keys(p.desc)) {
                        opdump.params[p.name].desc[tr] = p.desc[tr];
                    }
                }
                for (let tr of Object.keys(op.desc)) {
                    opdump.desc[tr] = op.desc[tr];
                }
            }
            dump[op.name] = opdump;
        }
        console.log(JSON.stringify(dump, null, 4));
    }

}


SteemApi.Blockchain = {
    ropoxtools : "ROPOX.APP",
    VIZTestnet : "VIZ-Testnet",
}

SteemApi.getDefaults = (blockchain) => {
    console.log("get defaults for", blockchain);
    switch (blockchain) {
        case SteemApi.Blockchain.VIZTestnet:
            return {
                ws : "wss://testnet.viz.world",
            }    
        case SteemApi.Blockchain.ropoxtools:
            return {
                ws : "wss://ws.viz.ropox.app",
            }      
    }

}


SteemApi.setBlockchain = function (
    ws = "wss://ws.viz.ropox.tools",
) {
    try {
        steem.api.stop();
    } catch(e) {
    }
    steem.config.set('websocket', ws);

}

export default SteemApi;
