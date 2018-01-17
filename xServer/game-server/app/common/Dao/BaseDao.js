/**
 * Created by bayilaoye on 10/4/17.
 */
 
var pomelo = require('pomelo');

var BaseDao = function() {
    this.TABLE_NAME = "";
    this.redisClient = pomelo.app.get("redisClient");
    this.redisPub = pomelo.app.get("redisPub");
    this.redisSub = pomelo.app.get("redisSub");
    this.persistentDao = pomelo.app.get("persistentDao");
};

BaseDao.prototype.pipeline = function () {
    return this.redisClient.pipeline();
};

module.exports = BaseDao;