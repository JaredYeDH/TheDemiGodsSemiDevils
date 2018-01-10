/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var CenterServerMgr = require('./../CenterServerMgr');

function onConnect() {
	this.handle = function(s) {
        logger.warn("onConnect, ip:"+s.c_ip+", port:"+ s.c_port);
		let protoNameSpace = MsgProtobuf.getInstance().Messages('GSToCS');
        let sndData = {
            msgid : protoNameSpace.MsgID.eMsgToCSFromGS_AskRegiste,
            gsid : 30001,
            usepwd : "123456"
        }

        let protoMsg = protoNameSpace.AskRegiste.create(sndData);
        let __bytes = protoNameSpace.AskRegiste.encode(protoMsg).finish();
        //s.connection.sendMessage(protoMsg.msgid, __bytes);
        CenterServerMgr.getDao().sendMessage(protoMsg.msgid, __bytes);
	}
}

function onHeartBeat() {
	this.handle = function() {
        let protoNameSpace = MsgProtobuf.getInstance().Messages('GSToCS');
        let sndData = {
            msgid : protoNameSpace.MsgID.eMsgToCSFromGS_AskPing,
            time : Date.now() / 1000,
        }
        let protoMsg = protoNameSpace.Asking.create(sndData);
        let __bytes = protoNameSpace.Asking.encode(protoMsg).finish();
        CenterServerMgr.getDao().sendMessage(protoMsg.msgid, __bytes);
	}
}

function onClose() {
	this.handle = function(s) {
        logger.warn("onClose ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var Handler = {
	"___connect___" : new onConnect(),
	"___close___"  : new onClose(),
	"___heartbeat___" : new onHeartBeat(),
};

var CenterServerInfoCfg = {
    "centerServerInfo" : {
        "serverip" : "192.168.30.100",
        "serverport" : 10002, 
        "is_server" : 0,
        "handler"  : Handler,
        "retry"   : true
    }
};

exports.CenterServerInfoCfg = CenterServerInfoCfg;
