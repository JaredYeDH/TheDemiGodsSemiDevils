var path = require('path');
var logger = require('pomelo-logger').getLogger('pomelo');
var protobufjs = require('protobufjs');
var glob = require("glob")

var MsgProtobuf = (function () {
    var instance = null;

    function createInstance() {
        var Messages = null;

        return {
            loadProto: function() {
                try {
                    // 该部分获取的只有文件名字
                    let patternList = ['node-glob/**/*.{proto,json}','*.proto', 'node-glob'];      //{,}中逗号后面不能有空格
                    let src = './app_configs/protos';
                    let pattern = '{'+patternList.join(',')+'}';
                    let filenames = glob.sync(pattern, {cwd:src, mark:true});
                    // 此处获取的是完整的温文件名 含文件路径
                    let files = glob.sync('./app_configs/protos/*.proto');
                    Messages = protobufjs.loadSync(files);
                    logger.debug('load *.proto files:' + Object.keys(Messages));
                    return true;
                } catch(err) {
                    logger.error("load *.proto files failed. : " + err.stack);
                    return false;
                }
                
            },
            Messages: function(protoNameSpace) {
            	return Messages[protoNameSpace];
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

module.exports = MsgProtobuf;