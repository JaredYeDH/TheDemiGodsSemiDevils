/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var CenterServerMgr = require('./../CenterServerMgr');
var SSBattleServerMgr = require('./../SSBattleServerMgr');

function onCnnect() {
	this.handle = function(s) {
        logger.warn("onCnnect,ip:"+s.c_ip+",port:"+ s.c_port);
	    let playerid = 15;
	    app.rpc.logic.logicRemote.testRpcOpr(playerid, 1, app.get('serverId'), 15, 15, function(res) {
			logger.warn('------------------------------- rpc test res : ' + res);
		});
	}
}

function onClose() {
	this.handle = function(s) {
        logger.warn("onClose ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var Handler = {
	"___connect___" : new onCnnect(),
	"___close___"  : new onClose(),
};

var GS2GCServiceCfg = {
	"gs2gcserviceCfg" :{
		"is_server" : 1,
		"handler" : Handler,
		"serverport" : 49996
	}
};

exports.GS2GCServiceCfg = GS2GCServiceCfg;
