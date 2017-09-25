const bodyParser = require('body-parser');
const compression = require('compression');
const router = require('./router')();

function init(app) {
  app.before = before;
  app.after = after;
  app.use(compression());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(router.middleware(app));
};

function before(fn) {
  router.befores.push(fn);
};

function after(fn) {
  router.afters.push(fn);
};

module.exports = {
  init,
  before,
  after
};
