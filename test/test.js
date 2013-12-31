var assert = require('assert'),
	config = require('../lib/config'),
	router = require('../lib/router')(),
	noop = function() {};

describe('config.read_routes', function() {
	var routes = config.read_routes('./routes', true);
	
	it('should read routes file', function() {
		assert.ok(routes);
	});

	it('should find correct number of routes', function() {
		var count = 0;
		for(var p in routes) {
			count++;
		}
		assert.equal(1, count);
	});
});

describe('router.middleware', function() {
	var app = {
		get: noop,
		post: noop,
		put: noop,
		delete: noop,
		settings: {
			routes: './routes',
			controllers: './controllers'
		}
	};

	router.middleware(app)(null, null, function() {
		it('should find correct number of routed controllers', function() {
			console.log(router.routes)
			assert.equal(1, router.routes.length);
		});
	});
});
