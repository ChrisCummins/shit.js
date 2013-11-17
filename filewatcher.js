var watchr = require('watchr');
var ctx = require('./ctx');
var FileCache = require('./filecache');

var FileWatcher = function(path, config, errorListener,
                           watchingListener, changeListener) {

  this.path = path;
  this.watcher = null;
  this.active = config.active;
  this.cache = new FileCache(path);

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

  this.close = function() {
    console.log('closing file watcher \'' + this.path + '\'');
    this.cache.close();
    if (this.watcher !== null)
      this.watcher.close();
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

};

module.exports = FileWatcher;
