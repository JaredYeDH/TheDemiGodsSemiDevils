/**
 * Created by bayilaoye on 10/4/17.
 */
'use strict';

var logger = require('pomelo-logger').getLogger('pomelo');
var PlatformType = require('../enum/PlatformType');
var OSType = require('../enum/OSType');

var AccountInfo = function() {
    this.osType = -1;
    this.platformType = -1;
    this.udid = null;
    this.deviceId = null;
    this.access_token = null;
    this.clientVer = '';
    this.createTime = new Date().getTime(); // million second
    this.gate_token = null; // used for gate to callback
    this.ip = "";
};

AccountInfo.prototype.unmarshal = function(jsonObj) {
    this.osType = jsonObj['osType'];
    this.platformType = parseInt(jsonObj['platformType']);
    this.udid = jsonObj['udid'];
    this.deviceId = jsonObj['deviceId'];
    this.access_token = jsonObj['access_token'];
    this.clientVer = jsonObj['clientVer'];
    
    if (PlatformType.DEVICE == this.platformType) {
        // udid is used for logic, so make udid=deviceId when client use device to verify 
        this.udid = this.deviceId;
    }
    this.ip = jsonObj["ip"] || "";
};

AccountInfo.prototype.copyFrom = function(jsonObj) {
    this.osType = jsonObj['osType'];
    this.platformType = jsonObj['platformType'];
    this.udid = jsonObj['udid'];
    this.deviceId = jsonObj['deviceId'];
    this.access_token = jsonObj['access_token'];
    this.clientVer = jsonObj['clientVer'];
    this.createTime = jsonObj['createTime'];
    this.gate_token = jsonObj['gate_token'];
    this.ip = jsonObj["ip"];
};

module.exports = AccountInfo;
