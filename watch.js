var config = require('./config').values;
var util = require('./util');
var watchr = require('watchr');

exports.createWatch = function(server) {

  var io = require('socket.io').listen(server);
  var socket = io.sockets;

  var clients = {};
  var sessions = [];

  var messages = [];

  function broadcast(sessions, command, data, exception) {
    for (var i=0, l=sessions.length; i < l ; i++) {
      if (!exception || sessions[i] != exception)
	clients[sessions[i]].emit(command, data);
    };
  };

  function pushMessage(type, msg, path) {
    messages.push({ type: type, message: msg, path: path });

    broadcast(sessions, 'messages', messages);
  };

  watchr.watch({
    paths: ['test'],
    listeners: {
      log: function(logLevel) {
        var array = Array.prototype.slice.call(arguments, 0);

        pushMessage('Debug', array, '');
      },
      error: function(error) {
        pushMessage('Error', error, '');
      },
      watching: function(error, watcherInstance, isWatching) {
        if (err) {
          pushMessage('Error', error, watcherInstance.path);
        } else {
          pushMessage("Log", 'Watching completed', watcherInstance.path);
        }
      },
      change: function(changeType, filePath,
                       fileCurrentStat, filePreviousStat) {
        pushMessage('Change', changeType + ', ' + fileCurrentState +
                    ', ' + filePreviousStat, filePath);
      }
    },
    next: function(error, watchers) {
      if (error) {
        pushMessage('Error', error, '');
      } else {
        pushMessage('Log', 'Watching completed', '');
      }
    }
  });

  socket.on('connection', function(client) {

    client.on('disconnect', function() {
      for (var i = 0, l = sessions.length; i < l ;  i++) {
	if (sessions[i] == client.id){
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

};
