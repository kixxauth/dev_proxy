var Promise = require('iou').Promise;

var HTTP = require('http')
  , URL = require('url')

  , YARGS = require('yargs')
  , PATH = require('filepath')
  , REQUEST = require('request')

  , LIB = require('./lib')


exports.main = function () {
  var opts = parse_options()
    , argv = opts.argv
    , run_opts = Object.create(null)

  if (argv.help) {
    console.log(opts.help())
    process.exit(1);
  }

  run_opts.serve_uri = argv.serve || 'http://localhost:8080';
  run_opts.target_uri = argv.target;
  run_opts.config_path = argv.config || config_path();

  exports.run(run_opts).then(print_output).catch(LIB.die);
};


// opts.serve_uri - The URI String of the dev_proxy server.
// opts.target_uri - The URI String of the target server.
// opts.config_path - The path String of the configuration file.
// callback - Callback Function is optional.
exports.run = function (opts, callback) {
  var state = Object.create(null)

  if (!opts.config_path) {
    throw new Error("You need to provide a config path.")
  }

  state.config_path = opts.config_path ? PATH.newPath(opts.config_path).resolve() : null;
  state.serve_uri = opts.serve_uri || null;
  state.target_uri = opts.target_uri || null;

  function on_success(state) {
    if (typeof callback === 'function') {
      callback(null, state);
    }
    return state;
  }

  function on_error(err) {
    if (typeof callback === 'function') {
      callback(err);
    } else {
      return Promise.reject(err);
    }
  }

  var promise = Promise.resolve(state)
    .then(LIB.middleware.config_reader)
    .then(LIB.middleware.file_watcher)
    .then(LIB.middleware.path_matcher)
    .then(LIB.middleware.http_server)
    .then(on_success)
    .catch(on_error);

  return promise;
};


function parse_options() {
  return YARGS.usage('Run a little server that reverse proxies to another server and optionally caches the results.')
    .alias('t', 'target')
    .describe('t', 'Target server URI like "http://localhost:3000". This is your project webserver.')
    .alias('s', 'serve')
    .describe('s', 'Proxy server URI like "http://192.168.1.102:8080". This is the URL you want to point your web browser at.')
    .alias('c', 'config')
    .describe('c', 'Configuration file path. See examples/rails.coffee for an example file.')
    .alias('h', 'help')
    .describe('h', "Print this help text.")
}


function config_path() {
  var filename = PATH.newPath().basename().toString() + '.coffee';
  return PATH.home().append('.dev_proxy', filename);
}


function print_output(state) {
  console.log('Listening for connections on '+ state.address.address +':'+ state.address.port +' '+ state.address.family);
  console.log('Proxying requests to '+ state.target_uri);
  console.log('Press CTRL+c to stop.');
}
