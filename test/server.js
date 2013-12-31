var shack = require('../index'),
	app = shack();

app.set('routes', './routes');
app.set('controllers', './controllers');

app.set('view engine', 'hbs');

app.before(function(req, res, next) {
	console.log('before'.info);
	next();
});
app.after(function(req, res, next) {
	console.log('after'.info);
	next();
});
app.after(shack.request_logger());

app.listen(9999);
console.log('listening on 9999');
