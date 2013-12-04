$(document).ready(function() {
  var activities = [];

  var server = 'http://' + real_time_server.host + ':' +
    real_time_server.port;
  var socket = io.connect(server);

  function newActivity(msg) {
    var desc = '';

    switch (parseInt(msg.type)) {
    case -1:
      desc = 'ERROR';
      break;
    case 0:
      desc = 'CREATE';
      break;
    case 1:
      desc = 'UPDATE';
      break;
    case 2:
      desc = 'DELETE';
      break;
    default:
      desc = 'UNKNOWN';
      break;
    }

    return {
      timestamp: new Date(msg.timestamp),
      path: msg.path,
      type: parseInt(msg.type),
      description: desc,
      message: msg.message
    };
  }

  function addNewActivity(msg) {
    activities.push(newActivity(msg));
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
    for (var i = 0; i < activities.length; i++)
      activities.pop();

    for (var i = 0; i < msgs.length; i++)
      addNewActivity(msgs[i]);

    $('#activities').html(watch.activities(activities.slice(0).reverse()));
  });

  socket.on('newMessage', function(msg) {
    addNewActivity(msg);

    $('#activities').html(watch.activities(activities.slice(0).reverse()));
  });

  socket.on('metaTags', function(msg) {
    $('#hostname').html(msg.hostname);
    $('#uptime').html(msg.uptime);
    $('#loadavg').html(msg.loadavg);
  });

  function Watch() {
    var self=this;
    self.name = ko.observable();
    self.activities = ko.observableArray();
  };

  var watch = new Watch();
  ko.applyBindings(watch);
});
