var assert = require('assert'),
	config = require('../lib/config'),
	router = require('../lib/router'),
	middleware = require('../lib/middleware'),
	flash = middleware.flash(),
	noop = function() {};

describe('config.read_routes', function() {
	var routes = config.read_routes(process.cwd() + '/test/routes', true);
	
	it('should read routes file', function() {
		assert.ok(routes);
	});

	it('should find correct number of routes', function() {
		var count = 0;
		for(var p in routes) {
			count++;
		}
		assert.equal(2, count);
	});
});

describe('router.middleware', function() {
	var app = {
		get: noop,
		post: noop,
		put: noop,
		delete: noop,
		settings: {
			routes: process.cwd() + '/test/routes',
			controllers: process.cwd() + '/test/controllers'
		}
	};

	it('should find correct number of routed controllers', function(done) {
		var router_inst = router();
		router_inst.middleware(app)(null, null, function() {
			assert.equal(2, router_inst.routes.length);
			done();
		});
	});
});

describe('controller.render', function() {
	var app = {
			get: noop,
			post: noop,
			put: noop,
			delete: noop,
			settings: {
				routes: process.cwd() + '/test/routes',
				controllers: process.cwd() + '/test/controllers'
			}
		},
		app_routes,
		req;

	function request(path, render, position) {
		var len = app_routes[path].length,
			res = { render:render, send:noop };

		position = position || 0;

		if(position < len) {
			app_routes[path][position](req, res, function() {
				request(path, render, position + 1);
			});
		}
	}

	app.get = function() {
		var path = arguments[0];

		app_routes[path] = [];

		for(var i = 1, len = arguments.length; i < arguments.length; i++) {
			app_routes[path].push(arguments[i]);
		}
	};

	it('should get to render successfully.', function(done) {
		app_routes = {};
		req = {};

		router().middleware(app)(null, null, function() {
			request('/test', function(view, data, callback) {
				assert.equal('test/index', view);
				assert.ok(data);
				assert.equal('test', data.page_name);
				assert.equal(undefined, data.messages);
				done();
			});
		});
	});

	it('should get to render with a flash message.', function(done) {
		app_routes = {};
		req = { session:{} };

		router().middleware(app)(null, null, function() {
			flash(req, null, function(req, res, next) {
				request('/test/flash', function(view, data, callback) {
					assert.ok(data.messages);
					assert.equal(1, data.messages.length);
					assert.equal('info', data.messages[0].type);
					done();
				});
			});
		});
	});
});

describe('middleware.flash', function() {
	var req,
		test_type = 'info',
		test_msg = 'Test flash message',
		msgs;

	beforeEach(function(done) {
		req = { session:{} };
		flash(req, null, function() {
			done();
		});
	});

	it('should create flash function on req object.', function(done) {
		assert.equal('function', typeof req.flash);
		done();
	});

	it('should include created messages.', function(done) {
		req.flash.call(req, test_type, test_msg);

		msgs = req.flash.call(req, test_type);

		assert.equal(1, msgs.length);
		assert.equal(test_msg, msgs[0]);

		done();
	});

	it('should delete messages after fetching.', function(done) {
		req.flash.call(req, test_type, test_msg);

		msgs = req.flash.call(req, test_type);
		assert.equal(1, msgs.length);

		msgs = req.flash.call(req, test_type);
		assert.equal(0, msgs.length);

		done();
	});
});
