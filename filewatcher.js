var watchr = require('watchr');
var ctx = require('./ctx');

var FileWatcher = function(path, config, errorListener,
                           watchingListener, changeListener) {

  this.path = path;
  this.watcher = null;

  function logListener(logLevel) {
    ctx.logger.log('ingo', JSON.stringify(arguments));
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
