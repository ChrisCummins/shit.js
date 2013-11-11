var config = require('./config').values;
var util = require('./util');
var FileWatcher = require('./filewatcher');

var Aikos = function(server) {

  var io = require('socket.io').listen(server);
  var socket = io.sockets;

  var clients = {};
  var sessions = [];

  var messages = [];

  var filewatchers = [];

  function createFileWatchers() {
    for (var f in config.aikos.files) {
      filewatchers.push(new FileWatcher(f, config.aikos.files[f]));
    }
  };

  function closeFileWatchers() {
    console.log('\nShutting down filewatchers.');
    for (var i = 0; i < filewatchers.length; i++)
      filewatchers[i].close();
  };

  function init() {
    createFileWatchers();

    process.on('SIGINT', function() {
      closeFileWatchers();
    });
  }

  function broadcast(sessions, command, data, exception) {
    for (var i=0; i < sessions.length; i++) {
      if (!exception || sessions[i] != exception)
	clients[sessions[i]].emit(command, data);
    };
  };

  function pushMessage(type, msg, path) {
    messages.push({
      type: type,
      message: msg,
      path: path
    });

    broadcast(sessions, 'messages', messages);
  };

  socket.on('connection', function(client) {

    client.on('disconnect', function() {
      for (var i = 0; i < sessions.length; i++) {
	if (sessions[i] == client.id) {
	  delete clients[client.id];
	  sessions.splice(i,1);
	  break;
	}
      };
    });

    client.on('join', function (data) {
      util.add(sessions, client.id);
      clients[client.id] = client;

      broadcast(sessions, 'messages', messages);
    });

  });

  init();
};

module.exports = Aikos;
