import steem from "steem"
import methods from "../steem/api/methods";
import { camelCase } from '../steem/util';
import types from "./types";


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
        console.log("Execute " + camelName + "Async(" + JSON.stringify(args) + ")" );
        return steem.api[camelName + "Async"].apply(steem.api, args);
        //return steem.api.getDynamicGlobalPropertiesAsync();
    }
}

class SteemApi {

    constructor() {
    
        this.methods = {};
        this.importMethods();
    }
    
    importMethods() {
        for(let m of methods) {
            if(!this.methods[m.api]) {
                this.methods[m.api] = {};
            }
            this.methods[m.api][m.method] = new Method(m.api, m.method, m.params);
        }
    }
    
    dump() {
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
        console.log(JSON.stringify(dump, null, 4));
    }
}


SteemApi.Blockchain = {
    GOLOS : "GOLOS",
    STEEMIT : "STEEMIT"
}

var BLOCKCHAIN = SteemApi.Blockchain.GOLOS;

SteemApi.setBlockchain = function(bc) {
    if(bc == SteemApi.Blockchain.STEEMIT) {
        BLOCKCHAIN = SteemApi.Blockchain.STEEMIT;
        steem.api.stop();
        steem.config.set('websocket',"wss://steemd.steemit.com");
        steem.config.set('address_prefix',"STM");
        steem.config.set('chain_id','0000000000000000000000000000000000000000000000000000000000000000');        
        console.log(steem.config.get('websocket'));
    } else {
        BLOCKCHAIN = SteemApi.Blockchain.GOLOS;
        steem.api.stop();
        steem.config.set('websocket',"wss://ws.golos.io");
        steem.config.set('address_prefix',"GLS");
        steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');        
        console.log(steem.config.get('websocket'));
    }
}

SteemApi.setBlockchain(SteemApi.Blockchain.GOLOS);

SteemApi.getBlockchain = function() {
    return BLOCKCHAIN;
}

export default SteemApi;
