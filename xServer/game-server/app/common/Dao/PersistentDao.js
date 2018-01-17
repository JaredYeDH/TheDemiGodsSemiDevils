/**
 * Created by bayilaoye on 10/4/17.
 */

var Promise = require('bluebird');
var logger = require('pomelo-logger').getLogger('pomelo');
var m = require('mongodb');
Promise.promisifyAll(m);
var mongo = m.MongoClient;
var MongoTables = require('../Enum/MongoTables');

var PersistentDao = function(mongoConfig) {
    var host = mongoConfig.host || '127.0.0.1';
    var port = mongoConfig.port || 27019;
    var user = mongoConfig.user;
    var password = mongoConfig.password;
    var dbName = mongoConfig.db;
    var self = this;
    var mongoUrl = "mongodb://" + host + ":" + port + "/" + dbName;
    logger.info("connect mongoUrl:", mongoUrl);
    mongo.connect(mongoUrl, function(err, db) {
        if (err) {
            logger.error("connect to %s fail with err %s", mongoUrl, err);
            return;
        }
        if (!user || !password) {
            self.db = db;
            return;
        }
        db.authenticate(user, password, function(err) {
            if (err) {
                logger.error("auth %s fail with err %s", mongoUrl, err);
                return;
            }
            self.db = db;
        });
    });
};

PersistentDao.prototype.wrapObj = function(obj) {
    if (!obj || typeof obj !== "object") {
        return obj;
    }
    var _date = new Date();
    var year = _date.getFullYear();
    var month = _date.getMonth()+1;
    var day = _date.getDate();
    var hour = _date.getHours();
    var min = _date.getMinutes();
    var sec = _date.getSeconds();
    var wrappedObj = JSON.parse(JSON.stringify(obj));
    wrappedObj._svDate = year + '-' + month + '-' + day;
    wrappedObj._svTime = hour + ':' + min + ':' + sec;
    wrappedObj._svDTime = Date.now();
    return wrappedObj;
};

PersistentDao.prototype.savePlayerId = function(pid, playerObj) {
    logger.info("start to save pid %d player data %s", pid, JSON.stringify(playerObj));
    if (!pid) {
        throw new Error("Invalid pid");
    }
    if (!playerObj || typeof playerObj !== "object") {
        throw new Error("Invalid player obj");
    }
    var self = this;
    var wrappedObj = self.wrapObj(playerObj);
    this.db.collection(MongoTables.PLAYER_IDINFO).updateOne(
        { _id : pid},
        { $set : wrappedObj },
        { upsert : true },
        function(err) {
            logger.info("finish save pid %d with err %s", pid, err);
        }
    );
};

PersistentDao.prototype.getPlayerIdCount = function(cb) {
    this.db.collection(MongoTables.PLAYER_IDINFO).count(function(err, count) {
        if (err) {
            logger.error('get player id count failed:' + err);
        }
        cb(count);
    })
};

PersistentDao.prototype.savePlayerBindPid = function(pid, bindInfo) {
    logger.info("start to save bindpid %d player data %s", pid, JSON.stringify(bindInfo));
    if (!pid) {
        throw new Error("Invalid pid");
    }
    if (!bindInfo || typeof bindInfo !== "object") {
        throw new Error("Invalid player obj");
    }
    var self = this;
    var wrappedObj = self.wrapObj(bindInfo);
    this.db.collection(MongoTables.PLAYER_IDBIND).updateOne(
        { _id : pid},
        { $set : wrappedObj },
        { upsert : true },
        function(err) {
            logger.info("finish bind pid %d with err %s", pid, err);
        }
    );
};

PersistentDao.prototype.queryRealtimeIncrAccount = function(date, cb) {
    this.db.collection(MongoTables.PLAYER_IDINFO).find({
        "_svDate" : date
    }).toArray(function(err, results) {
        var dataList = [];
        results.forEach(function(result) {
            dataList.push(result);
        });
        cb && cb(null, dataList);
    })
};

PersistentDao.prototype.savePlayerData = function(pid, playerObj) {
    logger.info("start to save pid %d player data %s", pid, JSON.stringify(playerObj));
    if (!pid) {
        throw new Error("Invalid pid");
    }
    if (!playerObj || typeof playerObj !== "object") {
        throw new Error("Invalid player obj");
    }
    var self = this;
    var wrappedObj = self.wrapObj(playerObj);
    this.db.collection(MongoTables.PLAYER_DATA).updateOne(
        { _id : pid},
        { $set : wrappedObj },
        { upsert : true },
        function(err) {
            logger.info("finish save pid %d with err %s", pid, err);
        }
    );
};

PersistentDao.prototype.getPlayerStatData = function(pid) {
    if (!pid) {
        throw new Error("getPlayerStatData:invalidPid:" + pid);
    }
    return this.db.collection(MongoTables.PLAYER_DATA).findAsync({
        _id: pid})
        .then(function(cursor) {
            return cursor.toArrayAsync();
        }).then(function(results) {
            //logger.info("getPlayerStatData results %s", JSON.stringify(results));
            var initObj = {id: pid};
            if (results.length === 0) {
                return initObj;
            }
            return results[0].playerStat || initObj;
        }).catch(function (e) {
            logger.error("getPlayerStatData exception " + e);
            return null;
        });
};

PersistentDao.prototype.getPlayerTaskStatData = function(pid) {
    if (!pid) {
        throw new Error("getPlayerTaskStatData:invalidPid:" + pid);
    }
    return this.db.collection(MongoTables.PLAYER_DATA).findAsync({
        _id: pid})
        .then(function(cursor) {
            return cursor.toArrayAsync();
        }).then(function(results) {
            var initObj = {id: pid};
            if (results.length === 0) {
                return initObj;
            }
            return results[0].taskStat || initObj;
        }).catch(function (e) {
            logger.error("getPlayerTaskStatData exception " + e);
            return null;
        });
};

PersistentDao.prototype.savePlayerStatData = function(pid, playerStat) {
    //logger.info("start to save pid %d player stat data %s", pid, JSON.stringify(playerStat));
    if (!pid) {
        throw new Error("Invalid pid");
    }
    if (!playerStat || typeof playerStat !== "object") {
        throw new Error("Invalid player stat obj");
    }
    var self = this;
    this.db.collection(MongoTables.PLAYER_DATA).updateOne(
        { _id : pid},
        { $set : {playerStat : playerStat} },
        { upsert : true },
        function(err) {
            logger.info("finish save stat pid %d with err %s", pid, err);
        }
    );
};

PersistentDao.prototype.savePlayerTaskStatData = function(pid, playerTaskStat) {
    if (!pid) {
        throw new Error("Invalid pid");
    }
    if (!playerTaskStat || typeof playerTaskStat !== "object") {
        throw new Error("Invalid player task stat obj");
    }
    var self = this;
    this.db.collection(MongoTables.PLAYER_DATA).updateOne(
        { _id : pid},
        { $set : {taskStat : playerTaskStat} },
        { upsert : true },
        function(err) {
            logger.info("finish save task stat pid %d with err %s", pid, err);
        }
    );
};
PersistentDao.prototype.saveIapData = function(transactionId, iapObj) {
    logger.info("start to save transactionId %s iap data %s", transactionId, JSON.stringify(iapObj));
    if (!transactionId) {
        throw new Error("Invalid transactionId");
    }
    if (!iapObj || typeof iapObj !== "object") {
        throw new Error("Invalid iap data");
    }
    var self = this;
    this.db.collection(MongoTables.IAP_DATA).updateOne(
        { _id : transactionId },
        self.wrapObj(iapObj),
        { upsert : true },
        function(err) {
            logger.info("finish save iap txn %s with err %s", transactionId, err);
        }
    );
};

PersistentDao.prototype.updateFbNotiClickNum = function(notiId, count) {
    if (!notiId) {
        throw new Error("Invalid notiId");
    }
    var obj = {
        clickPlayers: count
    };
    var self = this;
    var wrappedObj = self.wrapObj(obj);
    this.db.collection(MongoTables.FB_NOTI_CLICK).updateOne(
        {_id: notiId},
        wrappedObj,
        {upsert: true},
        function () {
            logger.info("fb noti %s click players update to %d", notiId, count);
        }
    );
};

PersistentDao.prototype.saveRegisterState = function(key, value) {
    if (!key) {
        return;
    }
    logger.info("saveRegisterState key %s value %s", key, JSON.stringify(value));
    var self = this;
    var wrappedObj = self.wrapObj(value);
    this.db.collection(MongoTables.ANALYSIS_DATA).updateOne(
        { _id : key },
        wrappedObj,
        { upsert : true },
        function(err) {
            logger.info("persistent register state %s", JSON.stringify(wrappedObj));
        }
    );
};

PersistentDao.prototype.queryPlayerByFbName = function(fbName, cb) {
    this.db.collection(MongoTables.PLAYER_DATA).find({
        "base.fbName" : new RegExp(fbName)
    }).toArray(function(err, results) {
        var playerList = [];
        results.forEach(function(result) {
            playerList.push(result.base);
        });
        cb && cb(null, playerList);
    })
};

PersistentDao.prototype.getPlayerMails = function(pid, cb) {
    this.db.collection(MongoTables.PLAYER_MAILS).find({
        PID : pid,
        recallType : null
    }).sort({_id : -1}).limit(30).toArray(cb);
};

PersistentDao.prototype.saveMail = function(mailObj, cb) {
    this.db.collection(MongoTables.PLAYER_MAILS).insertOne(mailObj, cb);
};

module.exports = PersistentDao;
