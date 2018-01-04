var extend = require('extend');
var logger = require('pomelo-logger').getLogger('pomelo');
var Utils = require('./Utils');

var GeneralConfig = function(jsonObj, env) {
    this.config = JSON.parse(JSON.stringify(jsonObj));
    this.config = extend(true, this.config, this.config[env]);
};

GeneralConfig.prototype.getConfig = function() {
    return this.config;
};

var GeneralConfigMan = (function () {
    var instance;

    function createInstance() {
        var env;
        var config = null;
        return {
            loadConfig: function (_env) {
                if (!!_env) {
                    env = _env;
                }
                var jsonObj = Utils.reloadConfig("./app_configs/general_config.json");
                config = new GeneralConfig(jsonObj, env);
                logger.info("base general config %s", JSON.stringify(config));
            },
            getConfig: function () {
                if (!config) {
                    return null;
                }
                return config.getConfig();
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = GeneralConfigMan;
