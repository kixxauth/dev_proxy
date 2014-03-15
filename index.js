var HTTP = require('http')
  , URL = require('url')

  , OPTIMIST = require('optimist')
  , HTTP_PROXY = require('http-proxy')


exports.main = function () {
  var server
    , proxy
    , connection_uri
    , opts = parseOptions()

  proxy = HTTP_PROXY.createProxyServer({target: opts.target});

  server = HTTP.createServer(function (req, res) {
    proxy.web(req, res);
  });

  connection_uri = URL.parse(opts.serve);
  server.listen(connection_uri.port, connection_uri.hostname, function () {
    var address = server.address()
      , hostname = address.address
      , port = address.port
      , family = address.family

    console.log('Listening for connections on '+ hostname +':'+ port +' '+ family);
    console.log('Proxying requests to '+ opts.target);
    console.log('Press CTRL+c to stop.')
  });
};

function parseOptions() {
  return OPTIMIST.usage('Run a little server that proxies to another server.')
    .demand('t')
    .alias('t', 'target')
    .describe('t', 'Target URI like "http://localhost:3000"')
    .alias('s', 'serve')
    .describe('s', 'Server URI like "http://192.168.1.102:8080"')
    .default('s', 'http://localhost:8080')
    .argv;
}
