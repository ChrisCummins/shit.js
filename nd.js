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

var fs = require('fs');

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

    function secondsToString(seconds) {
      var numyears = Math.floor(seconds / 31536000);
      var numdays = Math.floor((seconds % 31536000) / 86400);
      var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
      var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
      var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
      var s = ""
      if (numyears > 0 )
        s += numyears + " years ";
      if (numdays > 0 )
        s += numdays + " days ";
      if (numhours > 0 )
        s += numhours + " hours ";
      if (numminutes > 0 )
        s += numminutes + " minutes ";
      if (numseconds > 0 )
        s += numseconds+ " seconds";
      return s;
    }

    var uptime = secondsToString(Math.floor(parseFloat(fs.readFileSync('/proc/uptime').toString().split(" ")[0])));

    var loadavg = fs.readFileSync('/proc/loadavg').toString().split(" ");
    var loadavg0 = Math.floor(parseFloat(loadavg[0]) * 100);
    var loadavg1 = Math.floor(parseFloat(loadavg[1]) * 100);
    var loadavg2 = Math.floor(parseFloat(loadavg[2]) * 100);

    var msg = {
      hostname: fs.readFileSync('/etc/hostname').toString(),
      uptime: uptime,
      loadavg: loadavg0 + "%, " + loadavg1 + "%, " + loadavg2 + "%"
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
