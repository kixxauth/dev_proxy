var Promise = require('iou').Promise

  , Configurator = require('./configurator').Configurator


// Load and register the CoffeeScript module loader.
require('coffee-script').register();


exports.create = function (opts) {

  function read_file(path) {
    path = path.toString()
    var module

    try {
      module = require(path);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        err = new Error("Could not find config file at "+ path);
      }
      return Promise.reject(err);
    }
    return module;
  }

  function exec_block(module) {
    var err, configurator = Configurator.create()

    if (typeof module.config !== 'function') {
      err = new Error('Config file did not export.config');
      return Promise.reject(err);
    }

    module.config(configurator);
    return configurator;
  }

  function parse_configs(configurator) {
    return configurator.load();
  };

  return function (path) {
    return Promise.cast(path)
      .then(read_file)
      .then(exec_block)
      .then(parse_configs);
  };
};
