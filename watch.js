var config = require('./config').values;
var util = require('./util');

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

  function debug_tick() {

    function pushMessage(msg) {
      messages.push(msg);

      return messages;
    };

    pushMessage({ type: "Debug", message: new Date() });

    broadcast(sessions, 'messages', messages);
  };

  setInterval(debug_tick, 1000);

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
    });

  });

};
