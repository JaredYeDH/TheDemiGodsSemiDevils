var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');

var CSErrProto = function () {
}

CSErrProto.prototype.execute = function (connection, buff) {
    let protoNameSpace = MsgProtobuf.getInstance().Messages('SysProto');
	var receive_data = protoNameSpace.ErrInfo.decode(buff);
    logger.debug("receive buff:"+ JSON.stringify(receive_data));
    /*
	let sndData = {
    	msgid : protoNameSpace.MsgID.ErrInfo_Notify,
    	errcode : 2,
        errinfo : "errinfo"
    }
    let protoMsg = protoNameSpace.ErrInfo.create(sndData);
    let __bytes = protoNameSpace.ErrInfo.encode(protoMsg).finish();
    connection.sendMessage(protoMsg.msgid, __bytes);
    */
}

module.exports = CSErrProto;


