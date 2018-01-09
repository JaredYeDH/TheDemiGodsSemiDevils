var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var Random = require('../../../common/Random');

var CS2GSAskRegisteRet = function () {
}

CS2GSAskRegisteRet.prototype.execute = function (connection, msgheader, buff) {
    let protoNameSpace = MsgProtobuf.getInstance().Messages('CSToGS');
	var receive_data = protoNameSpace.AskRegisteRet.decode(buff);
    logger.debug("receive data:"+ JSON.stringify(receive_data));
    /*
	let sndData = {
    	msgid : protoNameSpace.MsgID.SysProto_HeartBeat,
    	time : Date.now(),
        serverinfo : Random.genUniqKey()
    }
    let protoMsg = protoNameSpace.AskRegisteRet.create(sndData);
    let __bytes = protoNameSpace.AskRegisteRet.encode(protoMsg).finish();
    connection.sendMessage(protoMsg.msgid, __bytes);*/
}

module.exports = CS2GSAskRegisteRet;


