$(document).ready(function() {
  var messages = [];

  var server = 'http://' + real_time_server.host + ':' +
    real_time_server.port;
  var socket = io.connect(server);

  function newMessage(msg) {
    return {
      timestamp: new Date(msg.timestamp),
      path: msg.path,
      type: msg.type,
      message: msg.message
    };
  }

  function pushMessage(msg) {
    messages.push(newMessage(msg));
  }

  socket.on('connect', function() {
    $('#socketio').html('<span class="label label-success">' +
                        'connected</label>');
    socket.emit('join', { id: user_id });
  });

  socket.on('disconnect', function() {
    $('#socketio').html('<span class="label label-danger">' +
                        'disconnected</label>');
  });

  socket.on('messages', function(msgs) {
    for (var i = 0; i < messages.length; i++)
      messages.pop();

    for (var i = 0; i < msgs.length; i++)
      pushMessage(msgs[i]);

    $('#messages').html(watch.messages(messages));
  });

  socket.on('newMessage', function(msg) {
    pushMessage(msg);

    $('#messages').html(watch.messages(messages));
  });

  function Watch() {
    var self=this;
    self.name = ko.observable();
    self.messages = ko.observableArray();
  };

  var watch = new Watch();
  ko.applyBindings(watch);
});
