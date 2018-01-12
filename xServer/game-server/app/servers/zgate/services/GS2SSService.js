/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var SSBattleServerMgr = require('./../SSBattleServerMgr');
var ClientConnctionMgr = require('../ClientConnctionMgr');

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

function onTransmit() {
    this.handle = function(msgheader, buffer) {
        let ret = false;
        do {
            let protoNameSpace = MsgProtobuf.getInstance().Messages('GYGSToGC');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToGCFromGS_Begin
                && msgheader._type < protoNameSpace.MsgID.eMsgToGCFromGS_End) {
                let clientConnection = ClientConnctionMgr.getInstance().Get(msgheader._gSrSessionId);
                if (clientConnection) {
                    clientConnection.sendMessage(msgheader._type, buffer);
                    logger.warn("gate server transmit center msg to client, detail:"+JSON.stringify(msgheader));
                } else {
                    logger.error("gate server transmit center msg to client failed, detail:"+JSON.stringify(msgheader));
                }
                ret = true;
            }
        } while(0);
        return ret;
    }
}

var GS2SSHandler = {
	"___connect___" : new onConnect(),
	"___close___"  : new onClose(),
	"___heartbeat___" : new onHeartBeat(),
    "___transmit___" : new onTransmit(),
};

exports.GS2SSHandler = GS2SSHandler;
