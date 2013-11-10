var config = require('./config').values

var app = require('./app').getApp(config)

var port = parseInt(process.argv[2]) || 8080

app.listen(port);

console.log('Server listening on port %d in %s mode',
            app.address().port, app.settings.env);
