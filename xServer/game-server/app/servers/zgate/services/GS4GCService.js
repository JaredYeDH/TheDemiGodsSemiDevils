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
        let clientSessionId = connection.getSessionId();
        ClientConnctionMgr.getInstance().Add(clientSessionId, connection);
        logger.debug("onCnnection client sessionId:%d, ip:%s, port:%d", clientSessionId, connection.c_ip, connection.c_port);
	}
}

function onClose() {
	this.handle = function(connection) {
        let clientSessionId = connection.getSessionId();
        ClientConnctionMgr.getInstance().Del(clientSessionId);
        logger.debug("onClose client connection sessionId:%d, ip:%s, port:%d", clientSessionId, connection.c_ip, connection.c_port);
	}
}

function onTransmit() {
    this.handle = function(connection, msgheader, buffer) {
        let ret = false;
        do {
            let protoNameSpace = MsgProtobuf.getInstance().Messages('GYGCToCS');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToGSToCSFromGC_Begin
                && msgheader._type < protoNameSpace.MsgID.eMsgToGSToCSFromGC_End) {
                let clientSessionId = connection.getSessionId();
                CenterServerMgr.getDao().sendMessage(msgheader._type, buffer, clientSessionId);
                msgheader._gSrSessionId = clientSessionId;
                logger.debug("gate server transmit msg to center server, detail:"+JSON.stringify(msgheader));
                ret = true;
                break;
            }
            protoNameSpace = MsgProtobuf.getInstance().Messages('GYGCToSS');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToGSToSSFromGC_Begin
                && msgheader._type < protoNameSpace.MsgID.eMsgToGSToSSFromGC_End) {
                let clientSessionId = connection.getSessionId();
                SSBattleServerMgr.getInstance().Get(20001).sendMessage(msgheader._type, buffer, clientSessionId);
                msgheader._gSrSessionId = clientSessionId;
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
