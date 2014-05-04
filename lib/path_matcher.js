var path_to_regexp = require('path_to_regexp')


exports.PathMatcher = function (spec) {
  this.keys = [];
  this.regexp = path_to_regexp(spec.path, this.keys, {
    sensitive: false
  , strict: false
  , end: true
  });
};

exports.PathMatcher.prototype.match = function (path) {
  var match, i, len
    , keys = this.keys
    , params = []

  if (match = this.regexp.exec(path)) {
    match.shift();
    len = match.length;
    for (i = 0; i < len; i += 1) {
      if (keys[i]) {
        params.push(match[i]);
      }
    }
    return params;
  }
  return false;
};

exports.PathMatcher.create = function (spec) {
  var matcher = spec.matcher || function () { return false; }
  return new exports.PathMatcher({matcher: matcher});
};
