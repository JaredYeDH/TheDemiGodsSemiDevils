var MsgHeader = function() {
    this._size =  0xFF;          // 消息大小 含消息头本身大小字节数
    this._type =  0xEE;          // 消息号
    this._placeHolder1 = 0xFF;   // 服务器之间通信用于 伪装消息号
    this._gSrSessionId = 0xFF;   // 服务器之间通信用于 客户端连接所在gate的session id


    this._endian = 'B';
    /*
     * 指定字节序 为Little Endian (默认：Big Endian)
     */
    this.littleEndian = function(){
        this._endian = 'L';
        return this;
    };

    /*
     * 指定字节序 为Big Endian (默认：Big Endian)
     */
    this.bigEndian = function(){
        this._endian = 'B';
        return this;
    };
};

MsgHeader.prototype.peek = function(buf) {
    //this._size = buf.readUInt32LE(0);
    //this._type = buf.readUInt32LE(4);
    let varLen = 4;
    let offset = 0;
    this._size = buf['readUInt' + (8*varLen) + ''+ this._endian +'E'](offset); offset += varLen;
    this._type = buf['readUInt' + (8*varLen) + ''+ this._endian +'E'](offset); offset += varLen;
    this._placeHolder1 = buf['readUInt' + (8*varLen) + ''+ this._endian +'E'](offset); offset += varLen;
    this._gSrSessionId = buf['readUInt' + (8*varLen) + ''+ this._endian +'E'](offset); offset += varLen;
};

MsgHeader.prototype.fill = function(buf) {
    //buf.writeUInt32(this._size, 0);
    //buf.writeUInt32(this._type, 4);
    let varLen = 4;
    let offset = 0;
    buf['writeUInt' + (8*varLen) + ''+ this._endian +'E'](this._size, offset); offset += varLen;
    buf['writeUInt' + (8*varLen) + ''+ this._endian +'E'](this._type, offset); offset += varLen;
    buf['writeUInt' + (8*varLen) + ''+ this._endian +'E'](this._placeHolder1, offset); offset += varLen;
    buf['writeUInt' + (8*varLen) + ''+ this._endian +'E'](this._gSrSessionId, offset); offset += varLen;
};

MsgHeader.prototype.size = function() {
    return 16;
};

module.exports = MsgHeader;