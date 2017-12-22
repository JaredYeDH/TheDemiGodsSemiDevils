var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');

var CSAskLogin = function () {
}

CSAskLogin.prototype.execute = function (connection, buff) {
	var receive_data = MsgProtobuf.getInstance().Messages('GCToLS').AskLogin.decode(buff);
    logger.debug("receive buff:"+ JSON.stringify(receive_data));

	let sndData = {
    	msgid : MsgProtobuf.getInstance().Messages('LSToGC').MsgID.eMsgToGCFromLS_NotifyLoginResult,
    	result : 15
    }
    let protoNameSpace = MsgProtobuf.getInstance().Messages('LSToGC');
    let protoMsg = protoNameSpace.LoginResult.create(sndData);
    //logger.debug('protoMsg :' + JSON.stringify(protoMsg.toJSON()));
    //logger.debug('protoMsg msgid:' + protoMsg.msgid);
    //logger.debug('protoMsg result:' + protoMsg.result);
    let __bytes = protoNameSpace.LoginResult.encode(protoMsg).finish();
    connection.sendMessage(protoMsg.msgid, __bytes);
}

module.exports = CSAskLogin;


