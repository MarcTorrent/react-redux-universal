/* eslint-disable */
var babelJestTransformer = require('babel-jest');

var transformer = babelJestTransformer.createTransformer();

module.exports = {
	process: function(src, filename) {
		if (/\.(png|scss)$/.test(filename)) {
			return '';
		} else {
			return transformer.process(src, filename);
		}
	}
};
