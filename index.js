var HTTP = require('http')
  , URL = require('url')

  , YARGS = require('yargs')
  , REQUEST = require('request')


exports.main = function () {
  var server
    , proxy
    , connection_uri
    , opts = parseOptions()
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

  server = HTTP.createServer(function (req, res) {
    console.log('request URL:', req.url);
    req.pipe(REQUEST(argv.target + req.url)).pipe(res);
  });

  connection_uri = URL.parse(argv.serve);
  server.listen(connection_uri.port, connection_uri.hostname, function () {
    var address = server.address()
      , hostname = address.address
      , port = address.port
      , family = address.family

    console.log('Listening for connections on '+ hostname +':'+ port +' '+ family);
    console.log('Proxying requests to '+ argv.target);
    console.log('Press CTRL+c to stop.')
  });
};

function parseOptions() {
  return YARGS.usage('Run a little server that proxies to another server.')
    .alias('t', 'target')
    .describe('t', 'Target URI like "http://localhost:3000"')
    .alias('s', 'serve')
    .describe('s', 'Server URI like "http://192.168.1.102:8080"')
    .default('s', 'http://localhost:8080')
    .alias('h', 'help')
    .describe('h', "Print this help text.")
}
