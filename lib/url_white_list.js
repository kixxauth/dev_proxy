exports.URLWhiteList = function (spec) {
  this.patterns = spec;
};

exports.URLWhiteList.prototype.match = function (url) {
  var i, pattern, len = this.patterns.length

  for (i = 0; i < len; i += 1) {
    pattern = this.patterns[i];
    if (url === pattern) {
      return true;
    } else if (typeof pattern.test === 'function' && pattern.test(url)) {
      return true;
    }
  }
  return false;
};

exports.URLWhiteList.create = function (spec) {
  return new exports.URLWhiteList(spec || []);
}