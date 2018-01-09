/**
 * Created by bayilaoye on 10/4/17.
 */

var MsgProtobuf = require('../../../modules/MsgProtobuf');
var ProtocolMan = require('../../../modules/ProtocolMan');
var CSAskLogin = require('./handlers/CSAskLogin');
var CSErrProto = require('./handlers/CSErrProto');
var CSHeartBeat = require('./handlers/CSHeartBeat');
var CS2GSAskPingRet = require('./handlers/CS2GSAskPingRet');
var CS2GSAskRegisteRet = require('./handlers/CS2GSAskRegisteRet');


var ProtocolRegistry = {
    register: function() {
        let protoNameSpace = MsgProtobuf.getInstance().Messages('GCToLS');
        ProtocolMan.getInstance().register(protoNameSpace.MsgID.eMsgToLSFromGC_AskLogin, new CSAskLogin);
        
        protoNameSpace = MsgProtobuf.getInstance().Messages('SysProto');
        ProtocolMan.getInstance().register(protoNameSpace.MsgID.ErrInfo_Notify, new CSErrProto);
        ProtocolMan.getInstance().register(protoNameSpace.MsgID.SysProto_HeartBeat, new CSHeartBeat);

        protoNameSpace = MsgProtobuf.getInstance().Messages('CSToGS');
        ProtocolMan.getInstance().register(protoNameSpace.MsgID.eMsgToGSFromCS_AskPingRet, new CS2GSAskPingRet);
        ProtocolMan.getInstance().register(protoNameSpace.MsgID.eMsgToGSFromCS_AskRegisteRet, new CS2GSAskRegisteRet);
    }
};

module.exports = ProtocolRegistry;