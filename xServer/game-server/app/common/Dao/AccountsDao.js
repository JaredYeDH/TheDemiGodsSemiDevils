/**
 * Created by bayilaoye on 10/4/2017.
 */

var util = require('util');
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('pomelo');
var BaseDao = require('./BaseDao');
var OSType = require('../enum/OSType');
var RedisTables = require('../enum/RedisTables');
var PlatformType = require('../enum/PlatformType');

var AccountsDao = function() {
    BaseDao.call(this);
    this.TABLE_NAME = RedisTables.CLIENTS_VERIFYED_LIST;
};

util.inherits(AccountsDao, BaseDao);

/**
 * set verifyed client
 * @return {Promise}
 */
AccountsDao.prototype.setVerifyedAccount = function(platformType, osType, udid, accountInfo) {
    var TableName = this.TABLE_NAME
    switch(platformType) {
        case PlatformType.DEVICE: {
                if (OSType.IOS == osType)
                    TableName = RedisTables.CLIENTS_VERIFYED_IOS_LIST;
                else
                    TableName = RedisTables.CLIENTS_VERIFYED_ANDROID_LIST;
            }
            break;
        case PlatformType.WEIBO:
            TableName = RedisTables.CLIENTS_VERIFYED_WEIBO_LIST;
            break;
        case PlatformType.WEIXIN:
            TableName = RedisTables.CLIENTS_VERIFYED_WEIXIN_LIST;
            break;
        case PlatformType.QQ:
            TableName = RedisTables.CLIENTS_VERIFYED_QQ_LIST;
            break;
        case PlatformType.MOBILENUMBER:
            TableName = RedisTables.CLIENTS_VERIFYED_MOBILENUMBER_LIST;
            break;
        default:
            logger.error('platform type err: %d', platformType);
            return this.redisClient.hset(TableName, udid, JSON.stringify(accountInfo));
    }
    return this.redisClient.hset(TableName, udid, JSON.stringify(accountInfo));
}

/**
 * get verifyed client
 * @return {Promise} - client info
 */
AccountsDao.prototype.getVerifyedAccount = function(platformType, osType, udid) {
    var TableName = this.TABLE_NAME
    switch(platformType) {
        case PlatformType.DEVICE: {
                if (OSType.IOS == osType)
                    TableName = RedisTables.CLIENTS_VERIFYED_IOS_LIST;
                else
                    TableName = RedisTables.CLIENTS_VERIFYED_ANDROID_LIST;
            }
            break;
        case PlatformType.WEIBO:
            TableName = RedisTables.CLIENTS_VERIFYED_WEIBO_LIST;
            break;
        case PlatformType.WEIXIN:
            TableName = RedisTables.CLIENTS_VERIFYED_WEIXIN_LIST;
            break;
        case PlatformType.QQ:
            TableName = RedisTables.CLIENTS_VERIFYED_QQ_LIST;
            break;
        case PlatformType.MOBILENUMBER:
            TableName = RedisTables.CLIENTS_VERIFYED_MOBILENUMBER_LIST;
            break;
        default:
            logger.error('platform type err: %d', platformType);
            return this.redisClient.hget(TableName, udid);
    }
    return this.redisClient.hget(TableName, udid);
}

/**
 * delete verifyed client
 * @return {Promise}
 */
AccountsDao.prototype.delVerifyedAccount = function(platformType, osType, udid) {
    var TableName = this.TABLE_NAME
    switch(platformType) {
        case PlatformType.DEVICE: {
                if (OSType.IOS == osType)
                    TableName = RedisTables.CLIENTS_VERIFYED_IOS_LIST;
                else
                    TableName = RedisTables.CLIENTS_VERIFYED_ANDROID_LIST;
            }
            break;
        case PlatformType.WEIBO:
            TableName = RedisTables.CLIENTS_VERIFYED_WEIBO_LIST;
            break;
        case PlatformType.WEIXIN:
            TableName = RedisTables.CLIENTS_VERIFYED_WEIXIN_LIST;
            break;
        case PlatformType.QQ:
            TableName = RedisTables.CLIENTS_VERIFYED_QQ_LIST;
            break;
        case PlatformType.MOBILENUMBER:
            TableName = RedisTables.CLIENTS_VERIFYED_MOBILENUMBER_LIST;
            break;
        default:
            logger.error('platform type err: %d', platformType);
            return this.redisClient.hdel(TableName, udid);
    }
    return this.redisClient.hdel(TableName, udid);
}

module.exports = {
    getDao: function() {
        return new AccountsDao();
    }
};
