/**
 * Created by bayilaoye on 10/4/17.
 */

var MsgProtobuf = require('../../../modules/MsgProtobuf');
var ProtocolMan = require('../../../modules/ProtocolMan');
var CSAskLogin = require('./handlers/CSAskLogin');

var ProtocolRegistry = {
    register: function() {
        let protoNameSpace = MsgProtobuf.getInstance().Messages('GCToLS');
        ProtocolMan.getInstance().register(protoNameSpace.MsgID.eMsgToLSFromGC_AskLogin, CSAskLogin);
    }
};

module.exports = ProtocolRegistry;