var Promise = require('iou').Promise

  , WATCHR = require('watchr')


exports.create = function () {
  return function (paths) {
    var promise, change_listener = function () {}

    function on_file_change(event, path) {
      change_listener(event, path);
    }

    promise = new Promise(function (resolve, reject) {

      function set_listener(handler) {
        change_listener = handler;
      }

      function on_complete(err, watchers) {
        if (err) return reject(err);
        return resolve(set_listener);
      }

      WATCHR.watch({
        paths: paths
      , listener: on_file_change
      , next: on_complete
      });
    });

    return promise;
  };
};
