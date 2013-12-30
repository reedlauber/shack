var assert = require('assert'),
	config = require('../lib/config');

describe('config.read_routes', function() {
	it('should read routes file', function() {
		var routes = config.read_routes('./routes');
		assert.ok(routes);
	});
});
