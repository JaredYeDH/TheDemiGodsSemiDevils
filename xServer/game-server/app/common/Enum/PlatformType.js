/**
 * Created by bayilaoye on 10/4/17.
 */

var PlatformType = {
    DEVICE: 0,
    WEIBO: 1,
    WEIXIN: 2,
    QQ: 3,
    MOBILENUMBER: 4,

    getStr: function(type) {
        switch (type) {
            case this.DEVICE:
                return "Device";
            case this.WEIBO:
                return "Weibo";
            case this.WEIXIN:
                return "Weixin";
            case this.QQ:
                return "QQ";
            case this.MOBILENUMBER:
                return "MobileNumber";
            default:
                return "";
        }
    },

    checkType: function(type) {
        switch (type) {
            case this.DEVICE:
            case this.WEIBO:
            case this.WEIXIN:
            case this.QQ:
            case this.MOBILENUMBER:
                return true;
            default:
                return false;
        }
    }
};

module.exports = PlatformType;