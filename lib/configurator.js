Promise = require('iou').Promise;

var GLOB = require('glob')


function Configurator() {
  var self = Object.create(null)
    , file_patterns = []
    , matchers = []

  self.watch = function (pattern) {
    file_patterns.push(pattern);
  };

  self.match = function (pattern, router) {
    if (typeof pattern !== 'string') {
      throw new Error("First argument to .match() must be a String pattern.");
    } else if (typeof router !== 'function') {
      throw new Error("Second argument to .match() must be a router Function.")
    }
    matchers.push({pattern: pattern, router: router});
  };

  self.include = function (pattern) {
    // TODO
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
      matchers: matchers,
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
