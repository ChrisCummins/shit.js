var config = require('./config').values

var app = require('./app').getApp(config)

var port = parseInt(process.argv[2]) || 8080
