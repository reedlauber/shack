const colors = require('colors');
const extend = require('extend');
const utils = require('./utils');

function noop() {}

function genUses(uses, ctrl) {
  return uses.map(function(fn) {
    return function(req, res, next) {
      fn(req, res, next, ctrl.settings);
    };
  });
}

function registerRoute(app, method, path, ctrl, action, befores, afters) {
  var args = [path]
          .concat(genUses(befores, ctrl))
          .concat([action])
          .concat(genUses(afters, ctrl))
          .concat([noop]);

  app[method].apply(app, args);
}

function getController(name, settings) {
  return utils.requireFile([`${settings.controllers}/${name}`]);
}

function readRoutes(app, callback) {
  const routes = utils.requireFile([app.settings.routes]);

  if(!routes) {
    return console.log(('Could not find routes config: ' + path).error);
  }

  Object.keys(routes).forEach((key) => {
    let method = 'get';
    let path = key;
    const routeOptions = routes[key];
    const controllerName = (typeof routeOptions === 'object')
      ? routeOptions.action
      : routeOptions;
    const controllerNameParts = controllerName.split(':');
    const controller = getController(controllerNameParts[0], app.settings);

    if(controller) {
      const action = controller.getAction(controllerNameParts[1] || 'index');
      const methodMatches = key.match(/^(get|post|put|delete) /i);

      if(methodMatches) {
        path = key.replace(methodMatches[0], '');
        method = methodMatches[1];
      }

      callback(method, path, controller, action);
    } else {
      console.error('Could not find controller in routes', controllerName);
    }
  });
}

function Router() {
  var self = this;

  self.befores = [];
  self.afters = [];
  self.routes = null;

  self.middleware = function(app) {
    return function(req, res, next) {
      if(!self.routes) {
        self.routes = [];

        readRoutes(app, function(method, path, controller, action) {
          registerRoute(app, method, path, controller, action, self.befores, self.afters);

          self.routes.push({ path, controller });
        });
      }

      next();
    };
  };
}

module.exports = function() {
  return new Router();
};
