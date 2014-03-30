var Promise = require('iou').Promise

  , WATCHR = require('watchr')

  , read_config_performer = require('./read_config_performer');


exports.cache_service = require('./cache_service');

exports.middleware = {
  config_reader: function (state) {
    var performer = read_config_performer.create_performer()

    function translate(config) {
      state.config = config;
      return state;
    }

    return performer(state.config_path).then(translate);
  },

  file_watcher: function (state) {
    function on_file_change(event, path) {
      console.log('CHANGE', event, path);
    }

    var promise = new Promise(function (resolve, reject) {
      function on_complete(err, watchers) {
        if (err) return reject(err);
        return resolve(state);
      }

      WATCHR.watch({
        paths: state.config.files
      , listener: on_file_change
      , next: on_complete
      });
    });

    return promise;
  },

  path_matcher: function (state) {
    return state;
  },

  http_server: function (state) {
    return state;
  }
};
