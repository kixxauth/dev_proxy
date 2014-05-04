var PathMatcher = require('./path_matcher').PathMatcher


exports.URLFromPath = function (spec) {
  this.matchers = spec.matching_functions.map(PathMatcher.create);
};

var proto = exports.URLFromPath.prototype;

proto.find = function (path) {
  var i, len = this.matchers.length, match

  for (i = 0; i < len; i += 1) {
    if ((match = matchers[i].match(path)) !== false) {
      return match;
    }
  }
  return false;
};

exports.URLFromPath.create = function(spec) {
  var matching_functions = spec.matching_functions || [];
  return new exports.URLFromPath({matching_functions: matching_functions});
};
