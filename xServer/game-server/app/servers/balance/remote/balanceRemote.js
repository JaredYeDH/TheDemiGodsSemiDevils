
var request = require('request');
var util = require("util");
var logger = require('pomelo-logger').getLogger('pomelo');
var GeneralConfigMan = require('../../../common/GeneralConfigMan');

/**
 * Created by bayilaoye on 08/04/2017.
 */
var balanceRemote = function(app) {
    this.app = app;
};

balanceRemote.prototype.getGateServer = function(uid, sid, cb) {
    getLocalIPAdress = function () {
        var interfaces = require('os').networkInterfaces();
        console.log(JSON.stringify(interfaces));
        for(var devName in interfaces){
              var iface = interfaces[devName];
              for(var i=0;i<iface.length;i++){
                   var alias = iface[i];
                   if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                         return alias.address;
                   }
              }
        }
    }
    var _gateinfo = {
        ip : getLocalIPAdress(),
        port : GeneralConfigMan.getInstance().getConfig().GS4GCPort,
        status : 2
    };
    cb && cb(_gateinfo);
};

module.exports = function(app) {
    return new balanceRemote(app);
};
