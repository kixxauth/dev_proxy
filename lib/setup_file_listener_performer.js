var Promise = require('iou').Promise

var FS = require('fs')

  , PATH = require('filepath')


exports.create = function () {
  return function (paths) {
    var promise, change_listener = function () {}

    function on_file_change(base) {
      var base = PATH.newPath(base);
      return function (event, filename) {
        if (!filename) return;
        if (/.(tmp|swp)$/.test(filename)) return;
        var path = base.append(filename).toString()
        change_listener(event, path);
      }
    }

    promise = new Promise(function (resolve, reject) {

      function set_listener(handler) {
        change_listener = handler;
      }

      paths.forEach(function (path) {
        FS.watch(path, {persistent: true}, on_file_change(path));
      });

      setTimeout(function () {
        resolve(set_listener);
      }, 100);
    });

    return promise;
  };
};
