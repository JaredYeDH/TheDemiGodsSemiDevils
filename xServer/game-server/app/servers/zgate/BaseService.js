/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../modules/MsgProtobuf');

function onCnnection() {
	this.handle = function(s) {
        logger.warn("onCnnection,ip:"+s.c_ip+",port:"+ s.c_port);
	    let playerid = 15;
	    app.rpc.logic.logicRemote.testRpcOpr(playerid, 1, app.get('serverId'), 15, 15, function(res) {
			logger.warn('------------------------------- rpc test res : ' + res);
		});
	}
}

function onConnected() {
	this.handle = function(s) {
        logger.warn("onConnected, ip:"+s.c_ip+", port:"+ s.c_port);
		let protoNameSpace = MsgProtobuf.getInstance().Messages('GSToCS');
        let sndData = {
            msgid : protoNameSpace.MsgID.eMsgToCSFromGS_AskRegiste,
            gsid : 30001,
            usepwd : "123456"
        }

        let protoMsg = protoNameSpace.AskRegiste.create(sndData);
        let __bytes = protoNameSpace.AskRegiste.encode(protoMsg).finish();
        s.connection.sendMessage(protoMsg.msgid, __bytes);
	}
}

function onClosed() {
	this.handle = function(s) {
        logger.warn("onClosed ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var ServerSideHandler = {
	"___connect___" : new onCnnection(),
	"___close___"  : new onClosed(),
};

var ClientSideHandler = {
	"___connect___" : new onConnected(),
	"___close___"  : new onClosed(),
};

var serverObj = {
	"zgate_1" :{
		"is_server" : 1,
		"handler" : ServerSideHandler,
		"serverport" : 49996
	}
};

var clientObj = {
	"clientcfg" : {
		"serverip" : "192.168.30.100",
    	"serverport" : 49996, 
		"is_server" : 0,
		"handler"  : ClientSideHandler,
        "retry"   : true
    }
};

exports.serverObj = serverObj;
exports.clientObj = clientObj;
