Promise = require('iou').Promise;

var GLOB = require('glob')


function Configurator() {
  var self = Object.create(null)
    , file_patterns = []
    , matchers = []
    , white_list = []
    , serve_uri = null
    , target_uri = null

  self.serve = function (uri) {
    var err

    if (typeof uri !== 'string') {
      err = new Error("serve URI must be a string.");
      err.code = 'CONFIG_ERR';
      throw err;
    }

    serve_uri = uri;
  };

  self.target = function (uri) {
    var err

    if (typeof uri !== 'string') {
      err = new Error("target URI must be a string.");
      err.code = 'CONFIG_ERR';
      throw err;
    }

    target_uri = uri;
  };

  self.watch = function (pattern) {
    file_patterns.push(pattern);
  };

  self.match = function (pattern, router) {
    var err

    if (typeof pattern !== 'string') {
      err = new Error("First argument to .match() must be a String pattern.");
      err.code = 'CONFIG_ERR';
      throw err;
    } else if (typeof router !== 'function') {
      err = new Error("Second argument to .match() must be a router Function.")
      err.code = 'CONFIG_ERR';
      throw err;
    }

    matchers.push({pattern: pattern, router: router});
  };

  self.include = function (pattern) {
    white_list.push(pattern);
  };

  self.load = function () {
    var state = Object.create(null)
    return read_file_patterns(state).then(translate);
  };

  function read_file_patterns(state) {
    return Promise.all(file_patterns.map(exec_glob_pattern))
      .then(concat_files)
      .then(function (files) {
        state.files = files;
        return state;
      });
  }

  function concat_files(files_of_files) {
    return files_of_files.reduce(function (res, files) {
      return res.concat(files);
    }, []);
  }

  function translate(state) {
    return {
      serve_uri: serve_uri,
      target_uri: target_uri,
      matchers: matchers,
      white_list: white_list,
      files: state.files
    };
  }

  return self;
};

Configurator.create = function () { return Configurator(); };

exports.Configurator = Configurator;


function exec_glob_pattern(pattern) {
  var promise

  promise = new Promise(function (resolve, reject) {
    GLOB(pattern, {}, function (err, files) {
      if (err) return reject(err);
      return resolve(files);
    });
  });

  return promise;
}
