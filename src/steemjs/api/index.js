import steem from "steem"
import methods from 'steem/lib/api/methods'
import operations from 'steem/lib/broadcast/operations'
import { camelCase } from '../steem/util';
import types from "./types";
import optypes from "./optypes";


class OpParam {
    constructor(op, name) {
        this.op = op;
        this.name = name;

        this.type = "String";
        this.desc = {en : "", ru : "", de : "", es : ""};
        
        if(optypes[op] 
            && optypes[op].params 
            && optypes[op].params[name]) {
            let meta = optypes[op].params[name];
            if(meta.type) {
                this.type = meta.type;
            }
            if(meta.desc) {
                for(let tr of Object.keys(meta.desc)) {
                    this.desc[tr] = meta.desc[tr];
                }
            }
        } 
    }
}


class Param {
    constructor(api, method, name) {
        this.api = api;
        this.method = method;
        this.name = name;

        this.type = "String";
        this.desc = {en : "", ru : "", de : "", es : ""};
        
        if(types[api] 
            && types[api][method] 
            && types[api][method].params 
            && types[api][method].params[name]) {
            let meta = types[api][method].params[name];
            if(meta.type) {
                this.type = meta.type;
            }
            if(meta.desc) {
                for(let tr of Object.keys(meta.desc)) {
                    this.desc[tr] = meta.desc[tr];
                }
            }
        } 
    }
}

class Operation {
    
    constructor(name, params) {
        this.name = name;
        this.paramNames = params;
        this.params = null;
        if(params && params.length > 0) {
            this.params = {};
            for(let p of params) {
                this.params[p] = new OpParam(name, p);
            }
        }
        this.desc = {en : "", ru : "", de : "", es : ""};
        if(optypes[name] 
            && optypes[name].desc) {
            for(let tr of Object.keys(optypes[name].desc)) {
                this.desc[tr] = optypes[name].desc[tr];
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



class Method {
    
    constructor(api, name, params) {
        this.api = api;
        this.name = name;
        this.paramNames = params;
        this.params = null;
        if(params && params.length > 0) {
            this.params = {};
            for(let p of params) {
                this.params[p] = new Param(api, name, p);
            }
        }
        this.desc = {en : "", ru : "", de : "", es : ""};
        if(types[api] 
            && types[api][name] 
            && types[api][name].desc) {
            for(let tr of Object.keys(types[api][name].desc)) {
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
        for(let m of methods) {
            if(!this.methods[m.api]) {
                this.methods[m.api] = {};
            }
            this.methods[m.api][m.method] = new Method(m.api, m.method, m.params);
        }
    }
    
    importOperations() {
        for(let op of operations) {
            this.operations[op.operation] = new Operation(op.operation, op.params);
        }
    }

    dumpMethods() {
        let dump = {};
        for(let api of Object.keys(this.methods)) {
            if(!dump[api]) {
                dump[api] = {};
            }
            for(let mname of Object.keys(this.methods[api])) {
                let m = this.methods[api][mname];
                let mdump = {desc :  {en : "", ru : "", de : "", es : ""}};
                if(m.params) {
                    mdump.params = {};
                    for(let pname of Object.keys(m.params)) {
                        let p = m.params[pname];
                        mdump.params[p.name] = {
                            type : p.type,
                            desc : {en : "", ru : "", de : "", es : ""}
                        }
                        for(let tr of Object.keys(p.desc)) {
                            mdump.params[p.name].desc[tr] = p.desc[tr];
                        }
                    }
                    for(let tr of Object.keys(m.desc)) {
                        mdump.desc[tr] = m.desc[tr];
                    }
                }
                dump[m.api][m.name] = mdump;
            }
        }
    }
    
    dumpOperations() {
        let dump = {};
        for(let opName of Object.keys(this.operations)) {
            let op = this.operations[opName];
            let opdump = {desc :  {en : "", ru : "", de : "", es : ""}};
            if(op.params) {
                opdump.params = {};
                for(let pname of Object.keys(op.params)) {
                    let p = op.params[pname];
                    opdump.params[p.name] = {
                        type : p.type,
                        desc : {en : "", ru : "", de : "", es : ""}
                    }
                    for(let tr of Object.keys(p.desc)) {
                        opdump.params[p.name].desc[tr] = p.desc[tr];
                    }
                }
                for(let tr of Object.keys(op.desc)) {
                    opdump.desc[tr] = op.desc[tr];
                }
            }
            dump[op.name] = opdump;
        }
        console.log(JSON.stringify(dump, null, 4));
    }
    
}


SteemApi.Blockchain = {
    GOLOS : "GOLOS",
    GOLOSTEST : "GOLOS Testnet",
    STEEMIT : "STEEMIT"
}

var BLOCKCHAIN = SteemApi.Blockchain.GOLOS;

SteemApi.setBlockchain = function(bc) {
    switch(bc) {
    case SteemApi.Blockchain.STEEMIT :
        BLOCKCHAIN = SteemApi.Blockchain.STEEMIT;
        steem.api.stop();
        steem.config.set('websocket',"wss://steemd.steemit.com");
        steem.config.set('address_prefix',"STM");
        steem.config.set('chain_id','0000000000000000000000000000000000000000000000000000000000000000');        
        break;
    case SteemApi.Blockchain.GOLOS:
        BLOCKCHAIN = SteemApi.Blockchain.GOLOS;
        steem.api.stop();
        steem.config.set('websocket',"wss://ws.golos.io");
        steem.config.set('address_prefix',"GLS");
        steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
        break;
    case SteemApi.Blockchain.GOLOSTEST:
        BLOCKCHAIN = SteemApi.Blockchain.GOLOSTEST;
        steem.api.stop();
        steem.config.set('websocket',"wss://ws.testnet.golos.io");
        steem.config.set('address_prefix',"GLS");
        steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
        break;
    }
}

SteemApi.setBlockchain(SteemApi.Blockchain.GOLOS);

SteemApi.getBlockchain = function() {
    return BLOCKCHAIN;
}

export default SteemApi;
