var logger = require('pomelo-logger').getLogger('pomelo');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var Random = require('../../../common/Random');

var CS2GSAskPingRet = function () {
}

CS2GSAskPingRet.prototype.execute = function (connection, msgheader, buff) {
    let protoNameSpace = MsgProtobuf.getInstance().Messages('CSToGS');
	var receive_data = protoNameSpace.AskPing.decode(buff);
    logger.debug("receive data:"+ JSON.stringify(receive_data));
}

module.exports = CS2GSAskPingRet;


