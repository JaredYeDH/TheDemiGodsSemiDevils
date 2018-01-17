/**
 * Created by bayilaoye on 10/4/17.
 */

var OSType = {
    ANDROID: 0,
    IOS: 1,

    getName: function(type) {
        switch (type) {
            case this.IOS:
                return "Iphone";
            case this.ANDROID:
                return "Android";
            default:
                return "";
        }
    },

    checkType: function(type) {
        switch (type) {
            case this.IOS:
            case this.ANDROID:
                return true;
            default:
                return false;
        }
    }
};


module.exports = OSType;