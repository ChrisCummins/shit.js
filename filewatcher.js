var watchr = require('watchr');

var FileWatcher = function(path, args) {

  watchr.watch({
    path: path,
    persistent: true,
    duplicateDelay: 2000,
    listeners: {
      log: function(logLevel) {
        // console.log('a log message occured:', arguments);
      },
      error: function(error) {
        console.log('an error occured:', error);
      },
      watching: function(error, watcherInstance, isWatching) {
        if (error) {
          console.log("watching the path " + watcherInstance.path + " failed with error", error);
        } else {
          console.log("watching the path " + watcherInstance.path + " completed");
        }
      },
      change: function(changeType, filePath,
                       currentStat, previousStat) {
        console.log('a change event occured:',arguments);
      }
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
