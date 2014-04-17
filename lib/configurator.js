Promise = require('iou').Promise;

var GLOB = require('glob')


function Configurator() {
  var self = Object.create(null)
    , file_patterns = []
    , routers = []

  self.watch = function (pattern) {
    file_patterns.push(pattern);
  };

  self.url = function (pattern, router) {
    routers.push(Router.create({pattern: pattern, router: router}));
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
      files: state.files
    };
  }

  return self;
};

Configurator.create = function () { return Configurator(); };

exports.Configurator = Configurator;


function Router(spec) {
  this.pattern = spec.pattern;
  this.router = spec.router;
}

Router.create = function (spec) {
  return new Router(spec);
}

exports.Router = Router;


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