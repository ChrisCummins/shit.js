var watchr = require('watchr');

var FileWatcher = function(path, args) {

  function logListener(logLevel) {
    console.log('a log message occured:', arguments);
  };

  function errorListener(error) {
    console.log('an error occured:', error);
  };

  function watchingListener(error, watcherInstance, isWatching) {
    if (error) {
      console.log("watching the path " + watcherInstance.path + " failed with error", error);
    } else {
      console.log("watching the path " + watcherInstance.path + " completed");
    }
  };

  function changeListener(changeType, filePath,
                          currentStat, previousStat) {
    console.log('a change event occured:',arguments);
  };

  watchr.watch({
    path: path,
    persistent: true,
    duplicateDelay: 2000,
    listeners: {
      log: logListener,
      error: errorListener,
      watching: watchingListener,
      change: changeListener,
    },
    next: function(error, watchers) {
      if (error) {
        return console.log("watching everything failed with error", error);
      } else {
        console.log('watching everything completed', watchers);
      }

    }
  });

};

module.exports = FileWatcher;
