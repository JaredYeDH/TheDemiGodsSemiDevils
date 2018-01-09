/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../modules/MsgProtobuf');

function on_user_socket_connect()
{
	this.handle = function(s)
	{
        logger.warn("on_user_socket_connect,ip:"+s.c_ip+",port:"+ s.c_port);
	    /*
	    s.nAliveTime = (new Date()).getTime();
	    s.interval = setInterval(function(){
	        help_user_tick(s);
	    },3*1000);*/
	    /*
	    let playerid = 15;
	    app.rpc.logic.logicRemote.testRpcOpr(playerid, 1, app.get('serverId'), 15, 15, function(res) {
			logger.error('-------------------------------' + res);
		});*/

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

function on_user_socket_close()
{
	this.handle = function(s)
	{
        logger.warn("on_user_socket_close ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var Handler = {
	"___connect___" : new on_user_socket_connect(),
	"___close___"  : new on_user_socket_close(),
};

var serverObj = {
	"zgate_1" :{
		"is_server" : 1,
		"handler" : Handler,
		"serverport" : 49996
	}
};
exports.serverObj = serverObj;

var clientObj = {
	"clientcfg" : {
		"serverip" : "192.168.30.100",
    	"serverport" : 49996, 
		"is_server" : 0,
		"handler"  : Handler,
        "retry"   : true
    }
};
exports.clientObj = clientObj;
