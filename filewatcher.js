var watchr = require('watchr');

var FileWatcher = function(path, args) {

  function pushMessage(type, msg, path) {
    console.log(type + ', ' + msg + ', ' + path);
  }

  watchr.watch({
    path: path,
    persistent: true,
    duplicateDelay: 2000,
    listeners: {
      log: function(logLevel) {
        var array = Array.prototype.slice.call(arguments, 0);

        // pushMessage('Debug', array, '');
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
                       currentStat, previousStat) {
        pushMessage('Change',
                    changeType + ', ' + currentState + ', ' + previousStat,
                    filePath);
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

};

module.exports = FileWatcher;
