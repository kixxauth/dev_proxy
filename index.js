Promise = require('iou').Promise

var HTTP = require('http')
  , URL = require('url')

  , YARGS = require('yargs')
  , PATH = require('filepath')
  , REQUEST = require('request')

  , LIB = require('./lib')


exports.main = function () {
  var opts = parse_options()
    , argv = opts.argv

  if (argv.help) {
    console.log(opts.help())
    process.exit(1);
  }

  if (!argv.target) {
    console.error("Missing required argument: --target\n");
    console.log(opts.help());
    process.exit(2);
  }

  exports.run({connection_uri: argv.serve, target_uri: argv.target}, function (address) {
    var hostname = address.address
      , port = address.port
      , family = address.family

    console.log('Listening for connections on '+ hostname +':'+ port +' '+ family);
    console.log('Proxying requests to '+ argv.target);
    console.log('Press CTRL+c to stop.')
  });
};


exports.run = function (opts, callback) {
  var server
    , proxy = create_proxy(opts.target_uri)
    , connection_uri = URL.parse(opts.connection_uri)

  server = HTTP.createServer(function (req, res) {
    var cached_response
    if (cached_response = LIB.cache_service.get(req)) {
      cached_response.pipe(res);
    } else {
      proxy(req, res);
    }
  });

  server.listen(connection_uri.port, connection_uri.hostname, function () {
    return callback(server.address());
  });
};

exports.run = function (opts, callback) {
  var promise = Promise.resolve({})

  promise = Promise.resolve(Object.create(null))
    .then(LIB.middleware.config_reader({path: }))
    .then(LIB.middleware.create_watcher())
    .then(LIB.middleware.create_router())
    .then(LIB.middleware.create_server({
      connection_uri: opts.connection_uri
    , target_uri: opts.target_uri
    }))
    .then(function (state) {
      if (typeof callback === 'function') {
        callback(null, state);
      }
      return state;
    })
    .fail(function (err) {
      if (typeof callback === 'function') {
        callback(err);
      } else {
        return Promise.reject(err);
      }
    });

  return promise;
};


function parse_options() {
  return YARGS.usage('Run a little server that proxies to another server.')
    .alias('t', 'target')
    .describe('t', 'Target URI like "http://localhost:3000"')
    .alias('s', 'serve')
    .describe('s', 'Server URI like "http://192.168.1.102:8080"')
    .default('s', 'http://localhost:8080')
    .alias('h', 'help')
    .describe('h', "Print this help text.")
}


function create_proxy(target) {
  return function (req, res) {
    var buffer = LIB.cache_service.cache(req)
    req.pipe(REQUEST(target + req.url)).pipe(buffer).pipe(res);
  };
}
