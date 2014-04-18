var URL = require('url')
  , HTTP = require('http')

  , REQUEST = require('request')

  , CACHE = require('./cache_service')


exports.create = function (opts) {

  return function (params) {
    var proxy = create_proxy(params.target_uri)
      , server = create_server(proxy)
      , serve_uri = URL.parse(params.serve_uri)

    return new Promise(function (resolve, reject) {
      server.listen(serve_uri.port, serve_uri.hostname, function () {
        return resolve(server.address());
      })
      server.on('error', reject);
    });
  };
}


function create_server(proxy) {
  return HTTP.createServer(function (req, res) {
    var cached_response
    if (cached_response = CACHE.get(req)) {
      cached_response.pipe(res);
    } else {
      proxy(req, res);
    }
  });
}


function create_proxy(target) {
  return function (req, res) {
    var buffer = CACHE.cache(req)
    req.pipe(REQUEST(target + req.url)).pipe(buffer).pipe(res);
  };
}
