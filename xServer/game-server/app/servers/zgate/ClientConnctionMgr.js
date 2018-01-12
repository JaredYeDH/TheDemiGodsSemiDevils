/**
 * Created by bayilaoye on 10/4/17.
 */
'use strict';
var logger = require('pomelo-logger').getLogger('pomelo');

var ClientConnctionMgr = function () {
    this.session_seed = 1;
    this.connection_List = {};
};

ClientConnctionMgr.prototype.Add = function(sessionid, connect) {
    this.connection_List[sessionid] = connect;
    logger.debug('connection_List count: %d', Object.keys(this.connection_List).length);
};

ClientConnctionMgr.prototype.Get = function(sessionid) {
    return this.connection_List[sessionid];
};

ClientConnctionMgr.prototype.Del = function(sessionid) {
    delete this.connection_List[sessionid];
    logger.debug('connection_List count: %d', Object.keys(this.connection_List).length);
};

ClientConnctionMgr.prototype.GenerateSessionId = function(sessionid) {
    return this.session_seed++;
};

var connectionListMgr = null;
module.exports = {
    getInstance: function() {
        if(!Boolean(connectionListMgr instanceof ClientConnctionMgr)) {
            connectionListMgr = new ClientConnctionMgr();
        }
        return connectionListMgr;
    }
};
