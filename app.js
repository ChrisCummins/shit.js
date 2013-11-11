var App = function(config) {

  var express = require('express');
  var app = express.createServer();
  var routes = require('./routes');

  function local_env(req, res, next) {
    res.local('real_time_server', config.server.production.real_time_server)
    next();
  }

  app.configure(function(){
    var oneYear = 31557600000;

    app.set('views', __dirname + '/www');
    app.set('view engine', 'ejs');
    app.register('.html', require('ejs'));
    app.register('.ejs', require('ejs'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    app.use(local_env);
    app.use(app.router);

    app.use(express.static(__dirname + '/www', { maxAge: oneYear }));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function (){
    app.use(express.errorHandler());
  });

  routes.configure(app);

  return app;
};

module.exports = App;
