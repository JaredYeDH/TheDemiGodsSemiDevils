/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var CenterServerMgr = require('./../CenterServerMgr');
var SSBattleServerMgr = require('./../SSBattleServerMgr');
var GeneralConfigMan = require('../../../common/GeneralConfigMan');
var ClientConnctionMgr = require('../ClientConnctionMgr');

function onCnnect() {
	this.handle = function(connection) {
	    let playerid = 15;
	    app.rpc.logic.logicRemote.testRpcOpr(playerid, 1, app.get('serverId'), 15, 15, function(res) {
			logger.warn('------------------------------- rpc test res : ' + res);
		});
        connection.setSessionId(ClientConnctionMgr.getInstance().GenerateSessionId());
        ClientConnctionMgr.getInstance().Add(connection.getSessionId(), connection);
        logger.debug("onCnnection, ip : "+connection.c_ip+",port:"+ connection.c_port + " sessionid : " + connection.getSessionId());
	}
}

function onClose() {
	this.handle = function(connection) {
        ClientConnctionMgr.getInstance().Del(connection.getSessionId());
        logger.debug("onClose client connection sessionId:%d, ip:%connection, port:%d", connection.getSessionId(), connection.c_ip, connection.c_port);
	}
}

function onTransmit() {
    this.handle = function(connection, msgheader, buffer) {
        let ret = false;
        do {
            let protoNameSpace = MsgProtobuf.getInstance().Messages('GYGCToCS');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToGSToCSFromGC_Begin
                && msgheader._type < protoNameSpace.MsgID.eMsgToGSToCSFromGC_End) {
                CenterServerMgr.getDao().sendMessage(msgheader._type, buffer, connection.getSessionId());
                logger.debug("gate server transmit msg to center server, detail:"+JSON.stringify(msgheader));
                ret = true;
                break;
            }
            protoNameSpace = MsgProtobuf.getInstance().Messages('GYGCToSS');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToGSToSSFromGC_Begin
                && msgheader._type < protoNameSpace.MsgID.eMsgToGSToSSFromGC_End) {
                SSBattleServerMgr.getInstance().Get(20001).sendMessage(msgheader._type, buffer, connection.getSessionId());
                logger.debug("gate server transmit msg to battlemgr server, detail:"+JSON.stringify(msgheader));
                ret = true;
            }
        } while(0);
        return ret;
    }
}

var Handler = {
	"___connect___" : new onCnnect(),
	"___close___"  : new onClose(),
    "___transmit___" : new onTransmit(),
};

var GS4GCServiceCfg = {
	"gs2gcserviceCfg" :{
		"is_server" : 1,
		"handler" : Handler,
		"serverport" : GeneralConfigMan.getInstance().getConfig().GS4GCPort
	}
};

exports.GS4GCServiceCfg = GS4GCServiceCfg;
