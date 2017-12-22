/**
 * Created by bayilaoye on 10/4/17.
 */
 
var ProtocolMan = (function () {
    var instance;

    function createInstance() {
        /**
         * protocol type => Protocol
         * @type {object.<string, Protocol>}
         */
        var protocolMap = {};

        return {
            /**
             * @param {Protocol} protocol
             */
            register: function(protocolType, protocol) {
                protocolMap[protocolType] = protocol;
            },

            /**
             *
             * @param {string} protoType
             * @returns {Protocol}
             */
            getProtocol: function(protoType) {
                return protocolMap[protoType];
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

module.exports = ProtocolMan;