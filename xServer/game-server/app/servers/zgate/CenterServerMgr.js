var logger = require('pomelo-logger').getLogger('pomelo');

var CenterServerMgr = (function () {
    var instance = null;
    return {
        Init: function (service) {
            instance = service;
        },
        getDao: function() {
        	if (!instance) {
        		logger.error('CenterServerMgr has not been inited.');
        		return null;
        	}
        	return instance.connection;
        }
    };
})();

module.exports = CenterServerMgr;
