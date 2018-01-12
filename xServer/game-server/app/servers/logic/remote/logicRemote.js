
var request = require('request');
var util = require("util");
var logger = require('pomelo-logger').getLogger('pomelo');

/**
 * Created by bayilaoye on 08/04/2017.
 */
var logicRemote = function(app) {
    this.app = app;
};

logicRemote.prototype.testRpcOpr = function(uid, sid, argv1, argv2, cb) {
    let _sum = argv1  + argv2;
    let _multi = _sum * 10;
    //logger.error('---------logicRemote.prototype.testRpcOpr uid:' + uid);
    //logger.error('---------logicRemote.prototype.testRpcOpr sid:' + sid);
    //logger.error('---------logicRemote.prototype.testRpcOpr argv1:' + argv1);
    //logger.error('---------logicRemote.prototype.testRpcOpr argv2:' + argv2);
    //logger.error('---------logicRemote.prototype.testRpcOpr result:' + _multi);
    cb && cb(_multi);
};

module.exports = function(app) {
    return new logicRemote(app);
};
