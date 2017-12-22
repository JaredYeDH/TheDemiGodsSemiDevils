var net = require("net");
var domain = require('domain');
var protobuf = require('pomelo-protobuf');
var logger = require('pomelo-logger').getLogger('pomelo');
var Connection = require('./Connection');
var MsgProtobuf = require('./MsgProtobuf');
var ProtocolMan = require('./ProtocolMan');

var SocketNet = function() {};

SocketNet.prototype.start_server = function(obj, cb)
{
    var self = this;

    var socket_server;

    if(obj)
    {
        for(var key in obj)
        {
            (function(k){
                var info = obj[k];
                if(typeof info.handler === "object")
                {
                    if(info.is_server == 1)
                    {
                        socket_server = net.createServer(function(sock) {
                            var d = domain.create();
                            d.on('error', function (err) {
                                logger.error("catch domain exception:" + err.stack);
                                var err_msg = {
                                    "op" : sock.op,
                                    "ret" : 42
                                };
                                sock.send(err_msg);
                                sock.emit("c_close");
                            });
                            d.add(sock);
                            sock.c_ip= sock.remoteAddress;
                            sock.c_port= sock.remotePort;

                            sock.send=function(buffer){
                                if(sock.writable) //{
                                    sock.write(buffer);
                                /*} else {
                                    logger.error("socket write err,writable :" + sock.writable);
                                    sock.emit("c_close");
                                }*/
                            }

                            var _connection = new Connection({"socket" : sock});
                            _connection.on('data',onReceivePackData);
                            _connection.on('close',onCloseConnection);

                            //当服务端收到完整的包时
                            function onReceivePackData(type, buffer) {
                                try
                                {
                                    var protocolFunc = ProtocolMan.getInstance().getProtocol(type);
                                    if (!protocolFunc) {
                                        logger.error("unrecognize proto type %d", type);
                                    } else {
                                        logger.warn("begin execute proto type %d", type);
                                        var protocol = new protocolFunc();
                                        protocol.execute(_connection, buffer);
                                    }
                                }
                                catch(err)
                                {
                                    logger.error("parse receive_data : " + err.stack);
                                    var err_msg = {
                                        "op" : sock.op,
                                        "ret" : 42
                                    };
                                    sock.send(err_msg);
                                    sock.emit("c_close");
                                }
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

                            //客户端默认是30秒发一次心跳
                            sock.setTimeout(1*30*1000);
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
                    }
                }
            })(key);
        }
    }
    else
    {
        logger.error("-- start no handler server -- ");
    }

    if(socket_server)
    {
        self.socket_server = socket_server;
    }

    if(cb)
    {
        cb(self);
    }
    //}
};

module.exports = SocketNet;