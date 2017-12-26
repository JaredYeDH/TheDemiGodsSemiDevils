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

function on_user_socket_connect()
{
	this.handle = function(s)
	{
        logger.warn("on_user_socket_connect,ip:"+s.c_ip+",port:"+ s.c_port);
	    /*
	    s.nAliveTime = (new Date()).getTime();
	    s.interval = setInterval(function(){
	        help_user_tick(s);
	    },3*1000);*/
	}
}

function on_user_socket_close()
{
	this.handle = function(s)
	{
        logger.warn("on_user_socket_close ,ip:"+s.c_ip+",port:"+ s.c_port);
	}
}

var handler = {
	"___connect___" : new on_user_socket_connect(),
	"___close___"  : new on_user_socket_close(),
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
			"serverip" : "2001:0:d362:47c3:38a8:36e2:3f57:e19b",
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

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
