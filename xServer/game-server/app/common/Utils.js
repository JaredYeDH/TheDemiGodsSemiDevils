/**
 * Created by liuyue on 15-6-19.
 */
var fs = require('fs');

var Utils = {
    reloadConfig : function(fileName) {
        if (fs.existsSync(fileName)) {
            var str = fs.readFileSync(fileName, {encoding: "utf8", flag: "r"});
            return JSON.parse(str);
        } else {
            return null;
        }
    },
    checkDateStr : function(dateStr) {
        var timestamp = Date.parse(dateStr);
        return !!timestamp && !isNaN(timestamp);
    },
    validateEmail: function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    },
    isInt: function(n){
        return Number(n) === n && n % 1 === 0;
    },
    getObjValues: function(obj) {
        if (!obj) {
            return [];
        }
        var values = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                values.push(obj[key]);
            }
        }
        return values;
    }
};

module.exports = Utils;
