var ResponseBuffer = require('./response_buffer').ResponseBuffer


exports.get = function () {
};

exports.cache = function (req) {
	return ResponseBuffer.create();
};