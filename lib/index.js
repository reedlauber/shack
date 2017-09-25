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

const colors = require('colors');
const express = require('express');

const shackApp = require('./application');
const router = require('./router');
const controller = require('./controller');
const middleware = require('./middleware');

colors.setTheme({ info: 'grey', highlight: 'cyan', success: 'green', warn: 'yellow', error: 'red' });

function createApp() {
	var app = express();
	shackApp.init(app);
	return app;
}

createApp.controller = controller;
createApp.request_logger = middleware.request_logger;
createApp.flash = middleware.flash;

module.exports = createApp;
