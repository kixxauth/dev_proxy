var UTIL = require ('util')

  , Duplex = require('stream').Duplex


function ResponseBuffer() {
  var self = this
  Duplex.call(this);
  this.pushing = false;
  this.write_buffer = [];
  this.response_complete = false;

  this.once('pipe', function (request) {
    request.once('response', function (response) {
      response.once('end', function () {
        self.response_complete = true;
        self.flush();
      })
    });
  });
}

UTIL.inherits(ResponseBuffer, Duplex);
exports.ResponseBuffer = ResponseBuffer;

ResponseBuffer.prototype._write = function (data, encoding, callback) {
  this.write_buffer.push(data);
  this.flush();
  callback();
  return true;
};

ResponseBuffer.prototype._read = function (size) {
  this.pushing = true;
  while (this.write_buffer.length) {
    this.push(this.write_buffer.shift());
  }
  if (this.response_complete) {
    this.push(null);
  }
};

ResponseBuffer.prototype.flush = function () {
  if (this.pushing) {
    this._read(this._readableState.highWaterMark);
  }
};

ResponseBuffer.create = function () {
  var stream = new ResponseBuffer();
  return stream;
};
