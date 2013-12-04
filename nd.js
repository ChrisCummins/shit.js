/*
 * nd.js - Notification Dispatcher
 *
 * Available exports:
 *     () The nd class.
 *
 * Usage:
 *     var Nd = require('./nd');
 *
 *     var nd = new Nd(); // Instantiate class
 */

/* Local imports */
var util = require('./util');

/*
 * The notification dispatcher.
 *
 * @param server An http server.
 */
var Nd = function(server) {

  /* Sockets */
  var io = require('socket.io').listen(server);
  var socket = io.sockets;

  /* The server sessions and clients */
  var sessions = [];
  var clients = {};

  /* The server state */
  var messages = [];

  /*
   * Broadcast a message
   *
   * @param sessions
   * @param command
   * @param data
   * @param exception
   */
  function broadcast(sessions, command, data, exception) {
    for (var i=0; i < sessions.length; i++) {
      if (!exception || sessions[i] != exception)
	clients[sessions[i]].emit(command, data);
    };
  };

  /*
   * Push all messages to sessions.
   */
  function pushAllMessages() {
    broadcast(sessions, 'messages', messages);
  }

  /*
   * Push a new message to sessions.
   *
   * Schema:
   *
   *  type: (int)  -1 error
   *                0 create
   *                1 update
   *                2 delete
   */
  function pushNewMessage(type, path, msg) {
    var msg = {
      timestamp: new Date().getTime(),
      type: parseInt(type),
      message: msg,
      path: path
    };

    messages.push(msg);
    broadcast(sessions, 'newMessage', msg);
  };

  function pushMetaData() {
    var msg = {
      hostname: 'foo',
      uptime: 'bar'
    };

    broadcast(sessions, 'metaTags', msg);
  };

  setInterval(pushMetaData, 1000);

  /*
   * Our socket connection.
   */
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

      pushAllMessages();
      pushMetaData();
    });

  });

  this.dispatchError = function(error) {
    pushNewMessage(-1, '', JSON.stringify(error));
  };

  this.dispatchUpdate = function(filePath, currentStat, previousStat) {
    pushNewMessage(1, filePath, JSON.stringify(currentStat));
  };

  this.dispatchCreate = function(filePath, currentStat, previousStat) {
    pushNewMessage(0, filePath, JSON.stringify(currentStat));
  };

  this.dispatchDelete = function(filePath, previousStat) {
    pushNewMessage(2, filePath, JSON.stringify(previousStat));
  };

};
module.exports = Nd;
