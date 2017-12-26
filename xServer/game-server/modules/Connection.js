var util = require('util');
var events = require('events');
var uuid = require('node-uuid');
var logger = require('pomelo-logger').getLogger('pomelo');
var MsgHeader = require('./MsgHeader');

var MAX_MSG_LENGTH = 16*1024;

var Connection = function(options) {
    var self = this;
    this.currentOffset = 0;
    this.currentLength = 0;
    this.currentMessage = null;
    this.lastLeftData = null;

    this.socket = options.socket;
    this.on('error', options.onError || onError);

    /***
     * Called whenever the socket receives data from the EventStore.
     * Splits the incoming data into messages, and passes each message to receiveMessage
     * @param data A Buffer containing the data received from Event Store
     */
    var msgDataLength = 0;
    this.onData = function(data) {
        msgDataLength += data.length;
        //logger.debug('receive msgDataLength:%d', msgDataLength);
        logger.debug('receive data length:%d', data.length);
        var packetLength = 0;
        while (data != null) {
            if (self.currentMessage == null) {
                // here is the start of a new message
                var _msgHeader = new MsgHeader().littleEndian();
                if (data.length < _msgHeader.size()) {
                    if (self.lastLeftData == null) {
                        self.lastLeftData = new Buffer(data.length);
                        data.copy(self.lastLeftData, 0, 0);
                        logger.warn('Invalid header length of ' + data.length + ' wait for next receiving data......');
                    } else {
                        // recevi data less than msg header size more than twice, disconnt it ...
                        logger.error('Invalid header length of ' + data.length + ' bytes. Needs to be at least big enough for the header');
                        self.onClose();
                    }
                    return;
                }

                if (self.lastLeftData) {
                    var _newbuffer = new Buffer(self.lastLeftData.length + data.length);
                    self.lastLeftData.copy(_newbuffer, 0, 0);
                    data.copy(_newbuffer, self.lastLeftData.length, 0);
                    data = _newbuffer;
                    self.lastLeftData = null;
                }

                _msgHeader.peek(data);
                if (_msgHeader._size > MAX_MSG_LENGTH) {
                    logger.error('Invalid message length msgtype:%d, msgsize:%d', _msgHeader._type, _msgHeader._size);
                    self.onClose();
                    return;
                }
                logger.debug('receive msg header:%s', JSON.stringify(_msgHeader));

                // The entire message will include the command length at the start
                var messageLength = _msgHeader._size;
                if (data.length == messageLength) {
                    // A single packet message, no need to copy into another buffer
                    receiveMessage(data);
                    data = null;
                } else if (data.length > messageLength) {
                    // Multiple messages in one packet
                    var firstMessage = data.slice(0, messageLength);
                    self.currentLength = messageLength;
                    receiveMessage(firstMessage);
                    data = data.slice(self.currentLength);
                } else {
                    // The first packet of a multi-packet message
                    self.currentMessage = new Buffer(messageLength);
                    packetLength = data.copy(self.currentMessage, self.currentOffset, 0);
                    self.currentOffset = packetLength;
                    data = null;
                }
            } else {
                var _msgHeader = new MsgHeader().littleEndian();
                _msgHeader.peek(self.currentMessage);
                var messageLength = _msgHeader._size;
                do {
                    if (data.length+self.currentOffset == messageLength) {
                        packetLength = data.copy(self.currentMessage, self.currentOffset, 0, messageLength-self.currentOffset);
                        self.currentOffset += packetLength;
                        receiveMessage(self.currentMessage);
                        data = null;
                    } else if (data.length+self.currentOffset > messageLength) {
                        packetLength = data.copy(self.currentMessage, self.currentOffset, 0, messageLength-self.currentOffset);
                        self.currentOffset += packetLength;
                        receiveMessage(self.currentMessage);
                        data = data.slice(packetLength);
                    } else {
                        packetLength = data.copy(self.currentMessage, self.currentOffset, 0);
                        self.currentOffset += packetLength;
                        data = null;
                        break;
                    }
                    self.currentMessage = null;
                    self.currentOffset = 0;
                } while(0);
            }
        }
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
    function receiveMessage(buf) {
        var _msgHeader = new MsgHeader().littleEndian();
        _msgHeader.peek(buf);
        self.emit("data", _msgHeader._type, buf.slice(_msgHeader.size()));
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
        self.socket.write(_newbuffer);
    } else {
        logger.error("socket write err,writable :" + self.socket.writable + ', proto info:' + JSON.stringify(_msgHeader));
        self.onClose();
    }
};

util.inherits(Connection, events); //继承事件类
module.exports = Connection;
