var ctrl = require('../../index').controller('test');

ctrl.action('flash', function(req, res, success) {
	req.flash('info', 'Here is some info...');
	success();
});

module.exports = ctrl;
