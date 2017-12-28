var util = require('util');
var events = require('events');
var uuid = require('node-uuid');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgHeader = require('./MsgHeader');
var NetBuffer = require('./NetBuffer');

var Connection = function(options) {
    var self = this;
    this.socket = options.socket;
    this.netbuffer = new NetBuffer();

    this.on('error', options.onError || onError);

    /***
     * Called whenever the socket receives data from the EventStore.
     * Splits the incoming data into messages, and passes each message to receiveMessage
     * @param data A Buffer containing the data received from Event Store
     */
    var msgDataLength = 0;
    this.onData = function(data) {
        self.netbuffer.push(data);
        do {
            var msg = self.netbuffer.pop();
            if (!msg.datast) {
                logger.error('Invalid message length msgtype:%d, msgsize:%d', msg.header._type, msg.header._size);
                self.onClose();
                break;
            }
            if (!Boolean(msg.data)) {
                logger.warn('Invalid message length wait for next received. msgtype:%d, msgsize:%d', msg.header._type, msg.header._size);
                break;
            }
            logger.debug('receive message : ' + JSON.stringify(msg.header));
            receiveMessage(msg.header, msg.data.slice(0, msg.header._size-msg.header.size()));
        } while(1);
    }

    /***
     * Called when the socket is closed (does nothing)
     * @param hadError true if the socket had a transmission error
     */
    this.onClose = function() {
        self.emit('close', 'msg data error.');
    }

    /***
     * Called when a socket error occurs
     * @param err The error that occurred
     */
    function onError(err) {
        self.onClose();
    }

    /***
     * Called when a complete message has arrived from the EventStore.
     * @param buf A Buffer containing a complete message
     */
    function receiveMessage(msgheader, buf) {
        self.emit("data", msgheader, buf);
    }
}

/***
 * Creates a Buffer containing a new v4 GUID
 * @returns {Buffer}
 */
Connection.createGuid = function() {
    var GUID_LENGTH = 16;
    var buffer = new Buffer(GUID_LENGTH);
    uuid.v4({}, buffer);
    return buffer;
};

/***
 * Sends a ping to the server and expects a pong response
 */
Connection.prototype.sendHeartBeat = function() {

};

Connection.prototype.sendMessage = function(command, buffer) {
    var _msgHeader = new MsgHeader().littleEndian();
    _msgHeader._size = _msgHeader.size() + buffer.length;
    _msgHeader._type = command;

    var _newbuffer = new Buffer(_msgHeader._size);
    _msgHeader.fill(_newbuffer);
    _newbuffer.fill(buffer, _msgHeader.size())

    var self = this;
    if(self.socket.writable) {
        //self.socket.write(_newbuffer);
        
        let ___newbuffer = new Buffer(_newbuffer.length*2);
        _newbuffer.copy(___newbuffer, 0, 0, _newbuffer.length);
        _newbuffer.copy(___newbuffer, _newbuffer.length, 0, _newbuffer.length);
        _newbuffer = ___newbuffer;
        let _randval = Math.floor(Math.random()*_msgHeader.size())+8;
        let _bufferSlice = _newbuffer.slice(0, _randval);
        self.socket.write(_bufferSlice);
        let _randval2 = _randval + Math.floor(Math.random()*(_newbuffer.length - _randval - Math.random()*32));
        _bufferSlice = _newbuffer.slice(_randval, _randval2);
        self.socket.write(_bufferSlice);
        _bufferSlice = _newbuffer.slice(_randval2, _newbuffer.length);
        self.socket.write(_bufferSlice);
        
    } else {
        logger.error("socket write err,writable :" + self.socket.writable + ', proto info:' + JSON.stringify(_msgHeader));
        self.onClose();
    }
};

util.inherits(Connection, events); //继承事件类
module.exports = Connection;
