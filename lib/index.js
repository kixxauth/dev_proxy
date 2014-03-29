var read_config_performer = require('./read_config_performer');


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
    // https://github.com/bevry/watchr
    return state;
  },

  path_matcher: function (state) {
    return state;
  },

  http_server: function (state) {
    return state;
  }
};
