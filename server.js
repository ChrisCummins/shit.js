var config = require('./config').values;
var app = require('./app').getApp(config);
var aikos = require('./aikos');

var port = parseInt(process.argv[2]) || 8080;

app.listen(port);
aikos.createAikos(app);

console.log('Server listening on port %d in %s mode.',
            app.address().port, app.settings.env);

process.on('SIGINT', function () {
	app.close();
	console.log('\nShutting down server.');
	process.exit(0);
})
