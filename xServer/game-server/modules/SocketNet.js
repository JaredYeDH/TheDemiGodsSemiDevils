var net = require("net");
var domain = require('domain');
var protobuf = require('pomelo-protobuf');
var logger = require('pomelo-logger').getLogger('pomelo');
var Connection = require('./Connection');
var MsgProtobuf = require('./MsgProtobuf');
var ProtocolMan = require('./ProtocolMan');
var Random = require('../app/common/Random');

var SocketNet = function() {};

SocketNet.prototype.start_server = function(obj, cb) {
    var self = this;
    var socket_server;
    var socketClient;

    if(obj) {
        for(var key in obj) {
            (function(k){
                var info = obj[k];
                if(typeof info.handler === "object") {
                    if(info.is_server == 1) {
                        socket_server = net.createServer(function(sock) {
                            var d = domain.create();
                            d.on('error', function (err) {
                                logger.error("catch domain exception:" + err.stack);
                                netErr();
                            });
                            d.add(sock);
                            sock.c_ip= sock.remoteAddress;
                            sock.c_port= sock.remotePort;

                            var _connection = new Connection({"socket" : sock});
                            _connection.on('data',onReceivePackData);
                            _connection.on('close',onCloseConnection);

                            //当服务端收到完整的包时
                            function onReceivePackData(type, buffer) {
                                try {
                                    var protocolFunc = ProtocolMan.getInstance().getProtocol(type);
                                    if (!protocolFunc) {
                                        logger.error("unrecognize proto type %d", type);
                                    } else {
                                        logger.debug("begin execute proto type %d", type);
                                        var protocol = new protocolFunc();
                                        protocol.execute(_connection, buffer);
                                    }
                                } catch(err) {
                                    logger.error("parse receive_data : " + err.stack);
                                    netErr();
                                }
                            }

                            function netErr(){
                                let protoNameSpace = MsgProtobuf.getInstance().Messages('SysProto');
                                let sndData = {
                                    msgid : protoNameSpace.MsgID.ErrInfo_Notify,
                                    errcode : 1
                                }
                                let protoMsg = protoNameSpace.ErrInfo.create(sndData);
                                let __bytes = protoNameSpace.ErrInfo.encode(protoMsg).finish();
                                _connection.sendMessage(protoMsg.msgid, __bytes);
                                sock.emit("c_close");
                            }

                            //当数据异常关闭客户端连接时
                            function onCloseConnection(buffer){
                                logger.error('数据异常关闭客户端连接!');
                                sock.emit("c_close");
                            }

                            sock.on("data",function(data){
                                _connection.onData(data);
                            });

                            sock.on("error",function(e){
                                logger.error("socket unknow err :" + e);
                                sock.emit("c_close");
                            });

                            sock.on("c_close",function(){
                                if(info.handler["___close___"])
                                    info.handler["___close___"].handle(sock);
                                sock.end();
                                sock.destroy();
                            });

                            sock.on("close",function(e){
                                if(info.handler["___close___"])
                                    info.handler["___close___"].handle(sock);
                                if(!sock.destroyed) {
                                    sock.end();
                                    sock.destroy();
                                }
                            });

                            if(info.handler["___connect___"])
                                info.handler["___connect___"].handle(sock);

                            //超过60s未发心跳包 断开连接
                            sock.setTimeout(1*60*1000);
                            sock.addListener("timeout",function(){
                                logger.debug("socket timeout, ip:"+sock.c_ip+",port:"+sock.c_port);
                                sock.emit("c_close");
                            });
                        });

                        setInterval(function(){socket_server.getConnections(function(err,count){
                            if(!err){logger.debug("server_count:"+count );}
                        })},15*60*1000);

                        socket_server.listen(info.serverport,function(){
                            logger.debug("listen on port: " + info.serverport + " ok!");
                        });
                    } else {
                        function connectserver(){
                            socketClient = net.connect(info.serverport,info.serverip, function(){
                                var _connection = new Connection({"socket" : socketClient});
                                _connection.on('data',onReceivePackData);
                                _connection.on('close',onCloseConnection);
                                socketClient.connection = _connection;
                                socketClient.connectStatus = true;
                                socketClient.lastHeartBeatTime = 0;

                                //当客户端收到完整的包时
                                function onReceivePackData(type, buffer){
                                    try {
                                        var protocolFunc = ProtocolMan.getInstance().getProtocol(type);
                                        if (!protocolFunc) {
                                            logger.error("unrecognize proto type %d", type);
                                        } else {
                                            logger.debug("begin execute proto type %d", type);
                                            var protocol = new protocolFunc();
                                            protocol.execute(_connection, buffer);
                                        }
                                    } catch(err) {
                                        logger.error("parse receive_data : " + err.stack);
                                        netErr();
                                    }
                                }

                                function netErr(){
                                    let protoNameSpace = MsgProtobuf.getInstance().Messages('SysProto');
                                    let sndData = {
                                        msgid : protoNameSpace.MsgID.ErrInfo_Notify,
                                        errcode : 1
                                    }
                                    let protoMsg = protoNameSpace.ErrInfo.create(sndData);
                                    let __bytes = protoNameSpace.ErrInfo.encode(protoMsg).finish();
                                    _connection.sendMessage(protoMsg.msgid, __bytes);
                                    socketClient.emit("c_close");
                                }

                                //当数据异常关闭客户端连接时
                                function onCloseConnection(buffer){
                                    logger.error('数据异常关闭客户端连接!');
                                    socketClient.emit("c_close");
                                }

                                socketClient.on("data",function(data){
                                    _connection.onData(data);
                                });

                                socketClient.on("error",function(e){
                                    logger.error("socket unknow err : " + e);
                                    socketClient.emit("c_close");
                                });

                                socketClient.on("c_close",function(){
                                    socketClient.end();
                                    socketClient.destroy();
                                    socketClient.connectStatus = false;
                                });

                                socketClient.on("close",function(e){
                                    if(info.handler["___close___"])
                                        info.handler["___close___"].handle(socketClient);
                                    if(!socketClient.destroyed) {
                                        socketClient.end();
                                        socketClient.destroy();
                                    }
                                    socketClient.connectStatus = false;
                                });

                                if(info.handler["___connect___"])
                                    info.handler["___connect___"].handle(socketClient);
                            })
                        }
                        connectserver();
                        setInterval( function() {
                            if(info.retry && !Boolean(socketClient.connectStatus)) {
                                connectserver();
                            } else if (socketClient.connectStatus) {
                                let _now = Date.now();
                                if (_now - socketClient.lastHeartBeatTime > 30*1000) {
                                    let protoNameSpace = MsgProtobuf.getInstance().Messages('SysProto');
                                    let sndData = {
                                        msgid : protoNameSpace.MsgID.SysProto_HeartBeat,
                                        time : Date.now(),
                                        serverinfo : Random.genUniqKey()
                                    }
                                    let protoMsg = protoNameSpace.HeartBeat.create(sndData);
                                    let __bytes = protoNameSpace.HeartBeat.encode(protoMsg).finish();
                                    socketClient.connection.sendMessage(protoMsg.msgid, __bytes);
                                    socketClient.lastHeartBeatTime = _now;
                                }
                            }
                        },3*1000); // 每3s检测一次 30s发一次心跳包
                    }
                }
            })(key);
        }
    } else {
        logger.error("-- start no handler server -- ");
    }

    if(socket_server) {
        self.socket_server = socket_server;
    }

    if(cb) {
        cb(self);
    }
};

module.exports = SocketNet;