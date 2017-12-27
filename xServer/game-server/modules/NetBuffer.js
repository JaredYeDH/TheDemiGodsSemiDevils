var logger = require('pomelo-logger').getLogger('pomelo');
var MsgHeader = require('./MsgHeader');

var MAX_MSG_LENGTH = 16*1024;

/*
 * 构造方法
 * @param bufferLength 缓存区长度，默认16K
 */
var NetBuffer = function (bufferLength) {
	var self = this;
    var _buffer = new Buffer(bufferLength || 1024*16); //nodejs中Buffer大于8kb 会使用slowBuffer，效率低
    var _putOffset = 0;  //存放数据起始位置
    var _readOffset = 0;   //读取缓存区时的起始位置

    this.push = function(buffer, offset, len){
        if(offset == undefined) offset = 0;
        if(len == undefined) len = buffer.length - offset;
        //buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])

        //当前缓冲区已经不能满足本次数数据了
        if(len + getLen() > _buffer.length){
            var ex = Math.ceil((len + getLen())/(1024));//每次扩展1kb的倍数
            var tmp = new Buffer(ex * 1024);
            var exlen = tmp.length - _buffer.length;
            _buffer.copy(tmp);
            if (_putOffset < _readOffset) {
                if (_putOffset <= exlen) {
                    tmp.copy(tmp, _buffer.length, 0, _putOffset);
                    _putOffset += _buffer.length;
                    if (_putOffset == tmp.length)
                        _putOffset = 0;
                } else {
                    tmp.copy(tmp, _buffer.length, 0, exlen);
                    tmp.copy(tmp, 0, exlen, _putOffset);
                    _putOffset -= exlen;
                }
            }
            _buffer = tmp;
        }
        if(getLen() == 0){
            //数据读完，从新copy新数据到buffer，清空原先的buffer数据、
            _putOffset = _readOffset = 0;
        }
        //判断是否会冲破_buffer尾部
        if((_putOffset + len) <= _buffer.length) {
            buffer.copy(_buffer,_putOffset,offset,offset + len);
            _putOffset += len;
            if (_putOffset == _buffer.length)
                _putOffset = 0;
        } else {
            //分两次存 一部分存在buffer尾部 一部分存在buffer头部
            var len1 = _buffer.length - _putOffset;
            if (len1 > 0) {
                buffer.copy(_buffer,_putOffset,offset,offset + len1);
                offset += len1;
            }
            
            var len2 = len - len1;
            buffer.copy(_buffer,0,offset,len);
            _putOffset = len2;
        }
    }

    this.peek = function() {
        let canBeRead = false;
        do {
            let msgheader = new MsgHeader().littleEndian();
            let _headLen = msgheader.size();
            if(getLen() < _headLen) //连包头都读不了
                break;
            if(_buffer.length - _readOffset >= _headLen){
                //读取包头，即传过来的字符串的长度
                msgheader.peek(_buffer.slice(_readOffset, _readOffset+_headLen));
                if (msgheader._size > getLen())
                    break;
            } else {
                let slice1 = _buffer.slice(_readOffset, _buffer.length - _readOffset);
                let slice2 = _buffer.slice(0, _headLen - slice1.length);
                msgheader.peek(Buffer.concat([slice1, slice2]));
                if (msgheader._size > getLen())
                    break;
            }
            canBeRead = true;
        } while (0);
        return canBeRead;
    }

    this.pop = function() {
        let datastatus = true; // true:正常 false:消息大小超出最大范围
        let databuff = null;
        let msgheader = new MsgHeader().littleEndian();
        do {
            let _headLen = msgheader.size();
            if(getLen() < _headLen)
                break;
            // 读取包头
            if(_buffer.length - _readOffset >= _headLen){
                //读取包头，即传过来的字符串的长度
                msgheader.peek(_buffer.slice(_readOffset, _readOffset+_headLen));
                if (msgheader._size > getLen())
                    break;
                _readOffset += _headLen;
                if (_readOffset == _buffer.length)
                    _readOffset = 0;
                //logger.error('111111 peek msgheader:' + JSON.stringify(msgheader) + ' _readOffset:' + _readOffset);
            } else {
                let slice1 = _buffer.slice(_readOffset, _buffer.length);
                let slice2 = _buffer.slice(0, _headLen - slice1.length);
                msgheader.peek(Buffer.concat([slice1, slice2]));
                if (msgheader._size > getLen())
                    break;
                _readOffset = slice2.length;
                //logger.error('222222 peek msgheader:' + JSON.stringify(msgheader) + ' _readOffset:' + _readOffset);
            }

            if (msgheader._size > MAX_MSG_LENGTH) { // 消息大小超出最大范围
                datastatus = false;
                break;
            }
            
            databuff = new Buffer(msgheader._size);
            if (!databuff) {
                //logger.error('malloc Buffer failed. need size:' + msgheader._size);
                break;
            }
            msgheader.fill(databuff);
            // 读取包头外的剩余数据
            let leftlen = msgheader._size - msgheader.size();
            if(_buffer.length - _readOffset >=  leftlen) {
                _buffer.copy(databuff, msgheader.size(), _readOffset, _readOffset += leftlen);
                if (_readOffset == _buffer.length)
                    _readOffset = 0;
            } else {
                var len1 = _buffer.length - _readOffset;
                if (len1 > 0)
                    _buffer.copy(databuff, msgheader.size(), _readOffset, _buffer.length);
                var len2 = leftlen - len1;
                _buffer.copy(databuff, msgheader.size()+len1, 0, len2);
                _readOffset = len2;
            }
        } while(0);
        return {data: databuff, datast: datastatus, header: msgheader};
    }
    
    //获取缓冲区已占用空间长度
    function getLen() {
        if(_putOffset >= _readOffset)
            return _putOffset -  _readOffset;
        return _buffer.length - _readOffset + _putOffset;
    }
};

module.exports = exports = NetBuffer;



