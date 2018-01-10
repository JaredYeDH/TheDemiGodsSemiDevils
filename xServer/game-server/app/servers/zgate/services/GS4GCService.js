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

function onTransmit() {
    this.handle = function(msgheader, buffer) {
        let ret = false;
        do {
            let protoNameSpace = MsgProtobuf.getInstance().Messages('GYGCToCS');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToSSFromGS_AskPing
                && msgheader._type > protoNameSpace.MsgID.eMsgToGSToCSFromGC_End) {
                CenterServerMgr.getDao().sendMessage(msgheader._type, buffer);
                logger.warn("gate server transmit msg to center server, detail:"+JSON.stringify(msgheader));
                ret = true;
                break;
            }
            protoNameSpace = MsgProtobuf.getInstance().Messages('GYGCToSS');
            if (msgheader._type > protoNameSpace.MsgID.eMsgToGSToSSFromGC_Begin
                && msgheader._type > protoNameSpace.MsgID.eMsgToGSToSSFromGC_End) {
                SSBattleServerMgr.getInstance().Get(20001).sendMessage(msgheader._type, buffer);
                logger.warn("gate server transmit msg to battlemgr server, detail:"+JSON.stringify(msgheader));
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
