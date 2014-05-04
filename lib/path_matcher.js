var path_to_regexp = require('path-to-regexp')


exports.PathMatcher = function (spec) {
  this.router = spec.router;
  this.regexp = path_to_regexp(spec.pattern, [], {
    sensitive: false
  , strict: false
  , end: true
  });
};

exports.PathMatcher.prototype.match = function (path) {
  var match
  if (match = match_path(this.regexp, path)) {
    return this.router.apply(Object.create(null), match.params);
  }
  return false;
};

exports.PathMatcher.create = function (spec) {
  return new exports.PathMatcher({
    router: spec.router || function () { return false; }
  , pattern: spec.pattern
  });
};


function match_path(regexp, file_path) {
  var match, i, len, path, params = []

  if (match = regexp.exec(file_path)) {
    path = match.shift();
    len = match.length;
    for (i = 0; i < len; i += 1) {
      params.push(match[i]);
    }
    return {path: path, params: params};
  }
  return false;
}
