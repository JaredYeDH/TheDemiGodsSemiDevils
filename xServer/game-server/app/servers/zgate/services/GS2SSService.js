/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var SSBattleServerMgr = require('./../SSBattleServerMgr');

function onConnect() {
	this.handle = function(s) {
        logger.warn("onConnect, ip:"+s.c_ip+", port:"+ s.c_port);
		let protoNameSpace = MsgProtobuf.getInstance().Messages('GSToSS');
        let sndData = {
            msgid : protoNameSpace.MsgID.eMsgToSSFromGS_AskRegiste,
            gsid : 30001,
            pwd : "123456"
        }

        let protoMsg = protoNameSpace.AskRegiste.create(sndData);
        let __bytes = protoNameSpace.AskRegiste.encode(protoMsg).finish();
        //s.connection.sendMessage(protoMsg.msgid, __bytes);
        SSBattleServerMgr.getInstance().Get(20001).sendMessage(protoMsg.msgid, __bytes);
	}
}

function onHeartBeat() {
	this.handle = function() {
        let protoNameSpace = MsgProtobuf.getInstance().Messages('GSToSS');
        let sndData = {
            msgid : protoNameSpace.MsgID.eMsgToSSFromGS_AskPing,
            time : Date.now() / 1000,
        }
        let protoMsg = protoNameSpace.AskPing.create(sndData);
        let __bytes = protoNameSpace.AskPing.encode(protoMsg).finish();
        SSBattleServerMgr.getInstance().Get(20001).sendMessage(protoMsg.msgid, __bytes);
	}
}

function onClose() {
	this.handle = function(s) {
        logger.warn("onClose ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var GS2SSHandler = {
	"___connect___" : new onConnect(),
	"___close___"  : new onClose(),
	"___heartbeat___" : new onHeartBeat(),
};

exports.GS2SSHandler = GS2SSHandler;
