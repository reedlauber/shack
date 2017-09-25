const path = require('path');
const shack = require('../index');
const app = shack();

app.set('routes', path.resolve(process.cwd(), './routes'));
app.set('controllers',  path.resolve(process.cwd(), './controllers'));

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
