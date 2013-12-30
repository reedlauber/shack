var extend = require('extend');

function default_callback(req, res, success) {
	success();
}

function Controller(name, options) {
	var _actions = {}, 
		_self = this,
		_options = extend({}, options);

	_self.name = name;
	_self.require_login = !!_options.require_login;

	_self.action = function(action_name, options, callback) {
		if(typeof options === 'function') {
			callback = options;
			options = {};
		} else if(!callback) {
			callback = default_callback;
			options = {};
		}
		
		_actions[action_name] = function(req, res, next) {
			callback(req, res, function(view, data) {
				if(typeof view === 'object') {
					data = view;
					view = null;
				}
				view = view || _self.name.replace(/\-/g, '_') + '/' + action_name;
				data = data || {};

				if(options.json) {
					data.success = true;
					data.status_code = 200;

					res.type('application/json');

					res.send(data);
				} else {
					if(typeof options.layout !== 'undefined') {
						req.locals.layout = options.layout;
					}

					var view_data = extend({ page_name:_self.name }, req.locals, data || {});

					res.render(view, view_data, function(err, html) {
						res.send(html);
					});
				}

				next();
			});
		};

		return _self;
	};

	_self.get_action = function(name) {
		return _actions[name] || _actions.index;
	};

	// Create a default pass-through index action
	_self.action('index');
}

Controller.prototype.toString = function() {
	return 'Controller: ' + this.name || 'unknown';
};

module.exports = function(name, options) {
	return new Controller(name, options);
};