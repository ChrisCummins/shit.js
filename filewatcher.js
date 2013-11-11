var watchr = require('watchr');

var FileWatcher = function(path, args) {

  this.path = path;
  this.watcher = null;

  function logListener(logLevel) {
    // console.log('a log message occured:', arguments);
  };

  function errorListener(error) {
    console.log('an error occured:', error);
  };

  function watchingListener(error, watcherInstance, isWatching) {
    if (error) {
      // console.log("watching the path " + watcherInstance.path + " failed with error", error);
    } else {
      // console.log("watching the path " + watcherInstance.path + " completed");
    }
  };

  function updateListener(filePath, currentStat, previousStat) {
    console.log('update! ', arguments);
  };

  function createListener(filePath, currentStat, previousStat) {
    console.log('[CREATE] path: ' + filePath + ', currentState: ' + currentStat +
                ', previousStat: ' + previousStat);
    console.log(currentStat);
    // console.log('create! ', arguments);
  };

  function deleteListener(filePath, previousStat) {
    console.log('delete! ', arguments);
  };

  function changeListener(changeType, filePath,
                          currentStat, previousStat) {
    switch (changeType) {
    case 'update':
      updateListener(filePath, currentStat, previousStat);
      break;
    case 'create':
      createListener(filePath, currentStat, previousStat);
      break;
    case 'delete':
      deleteListener(filePath, previousStat);
      break;
    default:
      console.log('Unhandled changeType: ' + changeType);
      break;
    }
    // console.log('a change event occured:',arguments);
  };

  function nextListener(error, watcher) {
    if (error) {
      return console.log("watching everything failed with error", error);
    } else {
      // console.log('watching everything completed', watcher);
    }

    this.watcher = watcher;
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
    next: nextListener
  });

  this.close = function() {
    console.log('Closing file watcher \'' + this.path + '\'');
    watcher.close();
  };

};

module.exports = FileWatcher;