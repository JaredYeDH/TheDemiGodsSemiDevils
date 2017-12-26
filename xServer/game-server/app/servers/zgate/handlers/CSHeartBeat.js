var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');

var CSHeartBeat = function () {
}

CSHeartBeat.prototype.execute = function (connection, buff) {
    let protoNameSpace = MsgProtobuf.getInstance().Messages('SysProto');
	var receive_data = protoNameSpace.HeartBeat.decode(buff);
    logger.debug("receive buff:"+ JSON.stringify(receive_data));
	let sndData = {
    	msgid : protoNameSpace.MsgID.SysProto_HeartBeat,
    	time : 2,
        serverinfo : "serverinfo"
    }
    let protoMsg = protoNameSpace.HeartBeat.create(sndData);
    let __bytes = protoNameSpace.HeartBeat.encode(protoMsg).finish();
    //connection.sendMessage(protoMsg.msgid, __bytes);
}

module.exports = CSHeartBeat;


