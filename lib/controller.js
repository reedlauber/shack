function defaultCallback(req, res, success) {
  success();
}

class Controller {
  constructor(name, settings = {}) {
    this.name = name;
    this.settings = {...settings};
    this.requireLogin = !!settings.requireLogin;
    this.actions = {};

    this.action('index');
  }

  getAction(name) {
    return this.actions[name] || action.index;
  }

  action(actionName, settings, callback) {
    if (typeof settings === 'function') {
      callback = settings;
      settings = {};
    } else if (!callback) {
      callback = defaultCallback;
      settings = {};
    }

    this.actions[actionName] = (req, res, next) => {
      callback(req, res, (view, data) => {
        if(typeof view === 'object') {
          data = view;
          view = null;
        }

        view = view || `${this.name.replace(/\-/g, '_')}/${actionName}`;
        data = data || {};

        if(settings.json) {
          data.success = true;
          data.status_code = 200;

          res.type('application/json');

          res.send(data);
        } else {
          if(typeof settings.layout !== 'undefined') {
            req.locals.layout = settings.layout;
          }

          let messages;
          if(typeof req.flash === 'function') {
            messages = req.flash();
          }

          const viewData = {
            pageName: this.name,
            messages,
            ...req.locals,
            ...data
          };

          if(typeof this.settings.prerender === 'function') {
            this.settings.prerender(req, viewData);
          }

          res.render(view, viewData, function(err, html) {
            res.send(html);
          });
        }

        next();
      });
    };
  }

  toString() {
    return `Controller: ${this.name}`;
  }
}

module.exports = function(name, settings) {
  return new Controller(name, settings);
};
