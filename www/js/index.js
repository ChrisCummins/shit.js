$(document).ready(function() {
  var messages = [];

  var server = 'http://' + real_time_server.host + ':' +
    real_time_server.port;
  var socket = io.connect(server);

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
    messages = msgs;

    $('#messages').html(watch.messages(messages));
  });

  socket.on('newMessage', function(msg) {
    messages.push(msg);

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
