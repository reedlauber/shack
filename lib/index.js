/*
Usage:

var shack = require('shack')
	app = shack();

app.set('routes', __dirname + '/config/routes.json');
app.set('controllers', __dirname + '/lib/controllers');

app.before(function(req, res, next) {
	req.user = {};

	next();
});

app.after(shack.request_logger());

*/ 

var colors = require('colors'),
	express = require('express'),
	shack_app = require('./application'),
	router = require('./router'),
	middleware = require('./middleware');

colors.setTheme({ info: 'grey', highlight: 'cyan', success: 'green', warn: 'yellow', error: 'red' });

function createApp() {
	var app = express();
	shack_app.init(app);
	return app;
}

createApp.request_logger = middleware.request_logger;

module.exports = createApp;