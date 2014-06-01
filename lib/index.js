var PATH = require('filepath')

  , CACHE = require('./cache_service')
  , URLFromPath = require('./url_from_path').URLFromPath
  , URLWhiteList = require('./url_white_list').URLWhiteList
  , read_config_performer = require('./read_config_performer')
  , setup_file_listener_performer = require('./setup_file_listener_performer')
  , setup_proxy_server_performer = require('./setup_proxy_server_performer')


exports.die = function (err) {
  console.error(err.stack);
  process.exit(2);
};

exports.middleware = {
  create_config_file: function (state) {
    var dir = state.config_path.dirname()

    function translate() {
      return state;
    }

    if (!dir.isDirectory()) {
      dir.mkdir();
    }
    if (!state.config_path.exists()) {
      return PATH.newPath(__dirname).dirname().append('examples', 'rails.coffee')
        .copy(state.config_path)
        .then(translate);
    }
    return state;
  },

  config_reader: function (state) {
    var performer = read_config_performer.create()

    function translate(config) {
      state.config = config;

      // Use some config settings if command line settings are missing.
      if (!state.serve_uri && config.serve_uri) {
        state.serve_uri = config.serve_uri;
      }
      if (!state.target_uri && config.target_uri) {
        state.target_uri = config.target_uri;
      }

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
      matchers: state.config.matchers
    });

    state.set_file_change_listener(function (action, path) {
      /*
      { '0': 'update', '1': 'app/assets/javascripts/app_registry.js' }
      { '0': 'create', '1': 'app/assets/javascripts/foo.js' }
      { '0': 'delete', '1': 'app/assets/javascripts/foo.js' }
      */

      // ! This callback is often called multiple times on a singe file change event.
      try {
        var url
        if (url = url_from_path.find(path)) {
          var now = new Date()
            , time = now.getHours() +':'+ now.getMinutes() +':'+ now.getSeconds()
          console.log('bust', time, url);
          CACHE.bust(url);
        }
      } catch (err) {
        exports.die(err);
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
    opts.white_list = URLWhiteList.create(state.config.white_list);
    return performer(opts).then(translate);
  }
};
