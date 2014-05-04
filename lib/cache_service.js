var ResponseBuffer = require('./response_buffer').ResponseBuffer
  , CachedStream = require('./cached_stream').CachedStream

  , cache = Object.create(null)


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

exports.bust = function (url) {
  var now = new Date()
    , time = now.getHours() +':'+ now.getMinutes() +':'+ now.getSeconds()
  console.log('bust', time, url);
  delete cache[url];
};
