/**
 * Created by bayilaoye on 15/4/23.
 */
var crypto = require('crypto');

function createRandKeyGenerator() {
    var seed = Date.now();

    return function () {
        var randBytesLen = 8;
        var key = '';
        var randBytes = crypto.randomBytes(randBytesLen).toString('hex');
        var auto = (seed++).toString(16);
        var ts = Date.now().toString(16);

        for (var i = 0; i < randBytesLen * 2; i++) {
            if (typeof randBytes[i] !== "undefined") {
                key += randBytes[i];
            }
            if (typeof auto[i] !== "undefined") {
                key += auto[i];
            }
            if (typeof ts[ts.length - i] !== "undefined") {
                key += ts[ts.length - i];
            }
        }
        return key;
    };
}

function createShortKeyGenerator() {
    var seed = Date.now();

    return function () {
        var key = '';
        var auto = (seed++).toString(16);
        var ts = Date.now().toString(16);

        for (var i = 0; i < ts.length; i++) {
            if (typeof auto[i] !== "undefined") {
                key += auto[i];
            }
            if (typeof ts[ts.length - i] !== "undefined") {
                key += ts[ts.length - i];
            }
        }
        return key;
    };
}

var Random = {
    PROMOTION_CODE_LEN: 6,
    /**
     * @returns {boolean}
     */
    nextBoolean: function() {
        return Math.random() < 0.5;
    },

    /**
     * @param upperValue
     * @returns {number}
     */
    nextInt: function(upperValue) {
        return Math.floor(Math.random() * upperValue);
    },

    /**
     * return the selected object
     * @param {object.<*, number>} probObj
     * @param {number} sum
     * @returns {*}
     */
    selectObject: function(probObj, sum) {
        var keys = Object.keys(probObj);
        var i;
        if (!sum) {
            sum = 0;
            for (i = 0; i < keys.length; ++ i) {
                sum += probObj[keys[i]];
            }
        }
        var result;
        var randValue = this.nextInt(sum);
        for (i = 0; i < keys.length; ++ i) {
            if (randValue < probObj[keys[i]]) {
                result = keys[i];
                break;
            } else {
                randValue -= probObj[keys[i]];
            }
        }
        return result;
    },

    /**
     * random an index according to the probability array.
     * @param {Array.<number>} probArray
     * @param {number} sum
     * @returns {number}
     */
    selectArray: function(probArray, sum) {
        var i;
        if (!sum) {
            sum = 0;
            for (i = 0; i < probArray.length; ++ i) {
                sum += probArray[i];
            }
        }
        var result = 0;
        var randValue = this.nextInt(sum);
        for (i = 0; i < probArray.length; ++ i) {
            if (randValue < probArray[i]) {
                result = i;
                break;
            } else {
                randValue -= probArray[i];
            }
        }
        return result;
    },

    /**
     * randomly pick some integers from [0, n)
     * @param {number} n
     * @param {number} pickCount
     * @returns {Array.<number>}
     */
    pick: function(n, pickCount) {
        var ret = [];
        var data = [];
        var i;
        for (i = 0; i < n; ++ i) {
            data[i] = i;
        }

        for (i = 0; i < pickCount; ++ i) {
            var pos = this.nextInt(n);
            ret[i] = data[pos];
            data[pos] = data[n - 1];
            -- n;
        }

        return ret;
    },

    /**
     * Randomly pick some integers from [0, probs.length) according to probs
     * @param {Array.<number>} probs
     * @param {number} pickCount
     * @returns {Array.<number>}
     */
    pickArray: function (probs, pickCount) {
        if (pickCount > probs.length) {
            throw new Error("Pick count is not allowed to be greater than the length of probs");
        }

        var ret = [];
        var data = [];
        var i;
        for (i = 0; i < probs.length; ++ i) {
            data[i] = i;
        }

        var n = probs.length;
        var probCopy = probs.slice();
        for (i = 0; i < pickCount; ++ i) {
            var index = this.selectArray(probCopy, 0);
            ret.push(data[index]);

            data[index] = data[n - 1];
            probCopy[index] = probCopy[n - 1];
            probCopy.length = n - 1;
            -- n;
        }

        return ret;
    },

    shuffleArray: function(array) {
        var counter = array.length, temp, index;
        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    },

    genUniqKey: createRandKeyGenerator(),
    genShortKey: createShortKeyGenerator(),

    genPromotionCode: function() {
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var code = '';
        for (var i = 0; i < this.PROMOTION_CODE_LEN; i++) {
            code += str.charAt(this.nextInt(str.length));
        }
        return code;
    }
};

module.exports = Random;