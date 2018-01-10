/**
 * Created by bayilaoye on 10/4/17.
 */

var app = require('pomelo').app;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var GS4GCService = require('./services/GS4GCService');
var GS2CSService = require('./services/GS2CSService');
var GS2SSService = require('./services/GS2SSService');

exports.GS4GCServiceCfg = GS4GCService.GS4GCServiceCfg;
exports.CenterServerInfoCfg = GS2CSService.CenterServerInfoCfg;
exports.GS2SSHandler = GS2SSService.GS2SSHandler;
