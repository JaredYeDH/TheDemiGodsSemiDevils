var logger = require('pomelo-logger').getLogger('pomelo');
var SocketNet = require('../../../../modules/SocketNet');
var MsgProtobuf = require('../../../../modules/MsgProtobuf');
var SSBattleServerMgr = require('../SSBattleServerMgr');
var BaseService = require('./../BaseService');

var CS2GSAskRegisteRet = function () {
}

CS2GSAskRegisteRet.prototype.execute = function (connection, msgheader, buff) {
    let protoNameSpace = MsgProtobuf.getInstance().Messages('CSToGS');
	var receive_data = protoNameSpace.AskRegisteRet.decode(buff);
    logger.debug('receive data:'+ JSON.stringify(receive_data));

    var socketNet = new SocketNet;
    if (Array.isArray(receive_data.ssinfo)) {
        receive_data.ssinfo.forEach(function(item, index){
            if (item.ip && item.port) {
                var clientObj = {
                    "clientcfg" : {
                        "serverip" : item.ip,
                        "serverport" : item.port, 
                        "is_server" : 0,
                        "handler"  : BaseService.GS2SSHandler,
                        "retry"   : true
                    }
                };
                socketNet.start_server(clientObj, function(service) {
                    SSBattleServerMgr.getInstance().Add(item, service);
                });
            }
        });
    }
}

module.exports = CS2GSAskRegisteRet;


