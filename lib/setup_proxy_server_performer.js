var URL = require('url')
  , HTTP = require('http')

  , REQUEST = require('request')
  , COLORS = require('colors')

  , CACHE = require('./cache_service')


exports.create = function (opts) {

  return function (params) {
    var proxy = create_proxy(params.target_uri, params.white_list)
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
      console.log(('from cache '+ req.url).green);
      cached_response.pipe(res);
    } else {
      proxy(req, res);
    }
  });
}


function create_proxy(target, white_list) {
  return function (req, res) {
    var buffer
    if (white_list.match(req.url)) {
      buffer = CACHE.cache(req)
      console.log(('stashing   '+ req.url).yellow);
      req.pipe(REQUEST(target + req.url)).pipe(buffer).pipe(res);
    } else {
      console.log(('pass       '+ req.url).red);
      req.pipe(REQUEST(target + req.url)).pipe(res);
    }
  };
}
