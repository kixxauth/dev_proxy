var CACHE = require('./cache_service')
  , URLFromPath = require('./url_from_path').URLFromPath
  , read_config_performer = require('./read_config_performer')
  , setup_file_listener_performer = require('./setup_file_listener_performer')
  , setup_proxy_server_performer = require('./setup_proxy_server_performer')


exports.middleware = {
  config_reader: function (state) {
    var performer = read_config_performer.create()

    function translate(config) {
      state.config = config;
      return state;
    }

    return performer(state.config_path).then(translate);
  },

  file_watcher: function (state) {
    var performer = setup_file_listener_performer.create()

    function translate(set_listener) {
      state.set_file_change_listener = set_listener;
      return state;
    };

    return performer(state.config.files).then(translate);
  },

  path_matcher: function (state) {
    var url_from_path = new URLFromPath.create({
      matching_functions: state.config.matching_functions
    });

    state.set_file_change_listener(function (action, path) {
      /*
      { '0': 'update', '1': 'app/assets/javascripts/app_registry.js' }
      { '0': 'create', '1': 'app/assets/javascripts/foo.js' }
      { '0': 'delete', '1': 'app/assets/javascripts/foo.js' }
      */
      var url
      if (url = url_from_path.find(path)) {
        CACHE.bust(url);
      }
    });
    return state;
  },

  http_server: function (state) {
    var performer = setup_proxy_server_performer.create()
      , opts = Object.create(null)

    function translate(address) {
      state.address = address;
      return state;
    }

    opts.target_uri = state.target_uri;
    opts.serve_uri = state.serve_uri;
    return performer(opts).then(translate);
  }
};
