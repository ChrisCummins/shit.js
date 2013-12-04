var App = require('./app');
var Shit = require('./shit');

var port = parseInt(process.argv[2]) || 8080;

var config = require('./config');
var ctx = require('./ctx');

ctx.init();

var app = new App(config).listen(port);
var shit = new Shit(app);

console.log('Server listening on port %d in %s mode.',
            app.address().port, app.settings.env);

process.on('SIGINT', function() {
  console.log('\nShutting down server.');
  app.close();
  ctx.close();
  process.exit(0);
})
