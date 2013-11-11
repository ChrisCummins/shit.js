exports.getApp = function(config) {

  var express = require('express');
  var app = module.exports = express.createServer();

  function local_env(req, res, next) {
    res.local('real_time_server', config.server.production.real_time_server)
    next();
  }

  app.configure(function(){
    app.set('views', __dirname + '/html');
    app.set('view engine', 'ejs');
    app.register('.html', require('ejs'));
    app.register('.ejs', require('ejs'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    app.use(local_env);
    app.use(app.router);

    var oneYear = 31557600000;
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

  require('./routes').configure(app);

  return app;
};
