var express = require('express');
var router = express.Router();
var logger = require('pomelo-logger').getLogger('pomelo');
var app = require('pomelo').app;
var async = require('async');
var util = require('util');
var ProtocolMan = require('../../../modules/ProtocolMan');


router.get('/', function(req, res) {
    logger.info("server api get");
    res.status(200).send("it works!");
});

router.get('/testget', function(req, res) {
    logger.warn('-----------------server api test req:%s', JSON.stringify(req.query));
    res.status(200).send(JSON.stringify(req.query));
});

router.get('/getgateserver', function(req, res) {
    var playerid = 15;
    app.rpc.balance.balanceRemote.getGateServer(playerid, 1, app.get('serverId'), function(data) {
        res.status(200).send(JSON.stringify(data));
    });
});


router.post('/testpost', function(req, res) {
    logger.warn('----------------- req.headers:%s', JSON.stringify(req.headers));
    logger.warn('----------------- req.query:%s', JSON.stringify(req.query));
    logger.warn('----------------- req.params:%s', JSON.stringify(req.params));
    logger.warn('----------------- req.body:%s', JSON.stringify(req.body));
    //res.send(200, 'test post worked.');
    res.status(200).send('test post worked.')
});


router.post('/socialrequestapi', function(req, res) {
    //logger.warn('----------------- req.headers:%s', JSON.stringify(req.headers));
    //logger.warn('----------------- req.query:%s', JSON.stringify(req.query));
    //logger.warn('----------------- req.params:%s', JSON.stringify(req.params));
    logger.warn('----------------- req.body:%s', JSON.stringify(req.body));
    var protocolType = req.body["type"];
    if (protocolType) {
        var protocolFunc = ProtocolMan.getInstance().getProtocol(protocolType);
        if (!protocolFunc) {
            logger.error("unrecognize proto type %s", protocolType);
            res.status(500).send(protocolType + 'not worked.')
            return;
        }
        logger.warn("begin execute proto type %s", protocolType);
        var protocol = new protocolFunc();
        protocol.unmarshal(req.body);
        protocol.execute(res);
    } else {
        res.status(403).send(protocolType + 'not worked.')
    }
});

function NoSuchService(req, res) {
    res.status(404).send("No Such Service!");
}

router.get('*', NoSuchService);
router.post('*', NoSuchService);

module.exports = router;
