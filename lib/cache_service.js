var ResponseBuffer = require('./response_buffer').ResponseBuffer
  , CachedStream = require('./cached_stream').CachedStream

  , cache = {}


exports.get = function (req) {
  var cached_response
  if (cached_response = cache[req.url]) {
    return CachedStream.create(cached_response);
  }
};

exports.cache = function (req) {
  var stream = ResponseBuffer.create()
  stream.on('end', function () {
    cache[req.url] = this.response();
  });
  return stream;
};
