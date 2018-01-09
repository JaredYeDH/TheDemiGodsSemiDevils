/**
 * Created by bayilaoye on 10/4/17.
 */
'use strict';
var logger = require('pomelo-logger').getLogger('pomelo');

var BattleServerInfo = function() {
     this.ssid = -1;
     this.ip = "";
     this.port = -1;
     this.netstate = -1;
     this.service = null;
};

BattleServerInfo.prototype.unmarshal = function(jsonObj) {
    this.ssid = parseInt(jsonObj['ssid']);
    this.ip = jsonObj['udid'];
    this.port = parseInt(jsonObj['port']);
    this.netstate = parseInt(jsonObj['netstate']);
};

var SSBattleServerMgr = function () {
    this.BattleServer_List = {};
};

SSBattleServerMgr.prototype.Add = function(info, service) {
    var battleInfo = new BattleServerInfo();
    battleInfo.service = service;
    this.BattleServer_List[battleInfo.ssid] = battleInfo;
    logger.debug('BattleServer_List count: %d', Object.keys(this.BattleServer_List).length);
};

SSBattleServerMgr.prototype.Get = function(ssid) {
    return this.BattleServer_List[ssid];
};

SSBattleServerMgr.prototype.Del = function(ssid) {
    delete this.BattleServer_List[ssid];
    logger.debug('BattleServer_List count: %d', Object.keys(this.BattleServer_List).length);
};

var battleServerMgr = null;
module.exports = {
    getInstance: function() {
        if(!Boolean(battleServerMgr instanceof SSBattleServerMgr)) {
            battleServerMgr = new SSBattleServerMgr();
        }
        return battleServerMgr;
    }
};
