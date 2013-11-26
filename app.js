var App = function(config) {

  var fs = require('fs');

  var credentials = {
    key: fs.readFileSync('key.pem').toString(),
    cert: fs.readFileSync('cert.pem').toString()
  };

  var express = require('express');
  var server = express.createServer(credentials);
  var routes = require('./routes');

  function local_env(req, res, next) {
    res.local('real_time_server', config.server.production.real_time_server)
    next();
  }

  server.configure(function(){
    var oneYear = 31557600000;

    server.set('views', __dirname + '/www');
    server.set('view engine', 'ejs');
    server.register('.html', require('ejs'));
    server.register('.ejs', require('ejs'));
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use(express.cookieParser());

    server.use(express.basicAuth(config.authentication.user,
                                 config.authentication.pass));

    server.use(local_env);
    server.use(server.router);

    server.use(express.static(__dirname + '/www', { maxAge: oneYear }));
  });

  server.configure('development', function(){
    server.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  server.configure('production', function (){
    server.use(express.errorHandler());
  });

  routes.configure(server);

  return server;
};

module.exports = App;
