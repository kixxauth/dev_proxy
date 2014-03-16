var UTIL = require ('util')

  , Duplex = require('stream').Duplex


function ResponseBuffer() {
  var self = this
  Duplex.call(this);
  this.pushing = false;
  this.write_buffer = [];
  this.response_buffer = [];
  this.response_status_code = null;
  this.response_headers = null;
  this.response_complete = false;

  this.once('pipe', function (request) {
    request.once('response', function (response) {
      self.response_status_code = response.statusCode;
      self.response_headers = response.headers;
      self.update_outgoing(self.response_status_code, self.response_headers);
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
  this.response_buffer.push(data);
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

ResponseBuffer.prototype.response = function () {
  return {
    statusCode: this.response_status_code
  , headers: this.response_headers
  , buffer: Buffer.concat(this.response_buffer)
  };
};

ResponseBuffer.prototype.pipe = function (outgoing) {
  this.outgoing_response = outgoing;
  return Duplex.prototype.pipe.call(this, outgoing);
};

ResponseBuffer.prototype.update_outgoing = function (status_code, headers) {
  Object.keys(headers).forEach(function (key) {
    this.outgoing_response.setHeader(key, headers[key]);
  }.bind(this));
  this.outgoing_response.writeHead(status_code);
};

ResponseBuffer.create = function () {
  var stream = new ResponseBuffer();
  return stream;
};
