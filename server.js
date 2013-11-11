var config = require('./config').values;
var App = require('./app');
var Aikos = require('./aikos');

var port = parseInt(process.argv[2]) || 8080;

var app = new App(config).listen(port);
var aikos = new Aikos(app);

console.log('Server listening on port %d in %s mode.',
            app.address().port, app.settings.env);

process.on('SIGINT', function() {
	app.close();
	console.log('\nShutting down server.');
	process.exit(0);
})
