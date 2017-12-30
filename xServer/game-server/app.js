var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'xServer');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});

function on_user_socket_connect(app)
{
	this._app = app;
	this.handle = function(s)
	{
        logger.warn("on_user_socket_connect,ip:"+s.c_ip+",port:"+ s.c_port);
	    /*
	    s.nAliveTime = (new Date()).getTime();
	    s.interval = setInterval(function(){
	        help_user_tick(s);
	    },3*1000);*/
	    let playerid = 15;
	    this._app.rpc.logic.logicRemote.testRpcOpr(playerid, 1, this._app.get('serverId'), 15, 15, function(res) {
			logger.error('-------------------------------' + res);
		});
	}
}

function on_user_socket_close(app)
{
	this._app = app;
	this.handle = function(s)
	{
        logger.warn("on_user_socket_close ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var handler = {
	"___connect___" : new on_user_socket_connect(app),
	"___close___"  : new on_user_socket_close(app),
};

app.configure('production|development', 'zgate', function(){
	var SocketNet = require("./modules/SocketNet");
	var MsgProtobuf = require("./modules/MsgProtobuf");
	var ProtocolRegistry = require('./app/servers/zgate/ProtocolRegistry');
	var obj = {
		"zgate_1" :{
			"is_server" : 1,
			"handler" : handler,
			"serverport" : 49996
		}
	};
	var _obj = {
		"clientcfg" : {
			"serverip" : "192.168.1.106",
	    	"serverport" : 49996, 
			"is_server" : 0,
			"handler"  : handler,
	        "retry"   : true
	    }
	};

	var zgate = new SocketNet;
	if (MsgProtobuf.getInstance().loadProto()) {
		ProtocolRegistry.register();
		zgate.start_server(obj,
			function(s){
				//game_server.server(s);
			}
		);
	}
});

app.configure('production|development', 'master|connector|zgate|logic', function () {
    var env = app.get('env');
    logger.info("env is " + env);
});

var logicRoute = function(playerid, msg, app, cb) {
    var logicServers = app.getServersByType('logic');
    if (!logicServers || logicServers.length === 0) {
        throw new Error("0 logic servers to route");
    }
    var index = playerid % logicServers.length;
    cb(null, logicServers[index].id);
};
app.configure('production|development', function() {
    app.route('logic', logicRoute);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
