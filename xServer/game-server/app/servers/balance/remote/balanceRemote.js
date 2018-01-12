
var request = require('request');
var util = require("util");
var logger = require('pomelo-logger').getLogger('pomelo');

/**
 * Created by bayilaoye on 08/04/2017.
 */
var balanceRemote = function(app) {
    this.app = app;
};

balanceRemote.prototype.getGateServer = function(uid, sid, cb) {
    var _gateinfo = {
        ip : "192.168.30.100",
        port : 59996,
        status : 2
    };
    cb && cb(_gateinfo);
};

module.exports = function(app) {
    return new balanceRemote(app);
};
