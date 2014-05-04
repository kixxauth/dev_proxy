var PathMatcher = require('./path_matcher').PathMatcher


exports.URLFromPath = function (spec) {
  this.matchers = spec.matchers.map(PathMatcher.create);
};

var proto = exports.URLFromPath.prototype;

proto.find = function (path) {
  var i, len = this.matchers.length, match

  for (i = 0; i < len; i += 1) {
    if ((match = this.matchers[i].match(path)) !== false) {
      return match;
    }
  }
  return false;
};

exports.URLFromPath.create = function(spec) {
  return new exports.URLFromPath({
    matchers: spec.matchers || []
  });
};
