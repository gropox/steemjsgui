import steem from "steem"
import methods from "../steem/api/methods";
import { camelCase } from '../steem/util';
import types from "./types";


class Param {
    constructor(api, method, name) {
        this.api = api;
        this.method = method;
        this.name = name;
        
        if(types[api] && types[api][method] && types[api][method][name]) {
            this.type = types[api][method][name].type;
        } else {
            this.type = "String";
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
