var fs = require('fs'),
	config = {};

config.read_routes = function(path, verbose) {
	path = path || process.cwd() + '/config/routes.json';

	try {
		return require(path);
	} catch(e) {
		if(verbose) {
			console.log(('Could not find routes config: ' + path).error);
		}
	}
};

module.exports = config;