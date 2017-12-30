//var ProtocolMan = require("../../../common/protocol/ProtocolMan");
var logger = require('pomelo-logger').getLogger('pomelo');


module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.protocolEntry = function(msg, session, next) {
    /*
    var protocolType = msg["type"];
    if (protocolType) {
        var protocolFunc = ProtocolMan.getInstance().getProtocol(protocolType);
        if (!protocolFunc) {
            logger.error("unrecognize proto type %s", protocolType);
            next(null);
            return;
        }
        logger.warn("begin execute proto type %s", protocolType);
        var protocol = new protocolFunc();
        protocol.unmarshal(msg);
        protocol.execute(this.app, session, next);
    }
    */
};