var UTIL = require ('util')

  , Readable = require('stream').Readable


function CachedStream(spec) {
  Readable.call(this);

  this.statusCode = spec.statusCode;
  this.headers = spec.headers;
  this.buffer = spec.buffer;
}

UTIL.inherits(CachedStream, Readable);
exports.CachedStream = CachedStream;

CachedStream.prototype._read = function () {
  this.push(this.buffer);
  this.push(null);
};

CachedStream.prototype.pipe = function (res) {
  Object.keys(this.headers).forEach(function (key) {
    res.setHeader(key, this.headers[key]);
  }.bind(this));
  res.writeHead(this.statusCode);
  return Readable.prototype.pipe.call(this, res);
};

CachedStream.create = function (spec) {
  return new CachedStream({
    statusCode: spec.statusCode
  , headers: spec.headers
  , buffer: spec.buffer
  });
};
