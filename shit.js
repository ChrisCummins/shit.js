/*
 * shit.js - Events Analyser
 *
 * Available exports:
 *     () The Shit class.
 *
 * Usage:
 *     var Shit = require('./shit');
 *
 *     var shit = new Shit(); // Instantiate class
 *
 * Config settings:
 */

/* Local imports */
var config = require('./config').shit;
var FileWatcher = require('./filewatcher');
var Nd = require('./nd');
var util = require('./util');

/*
 * The Shit class.
 *
 * @param server An http server.
 */
var Shit = function(server) {

  /* The notification dispatcher */
  var nd = new Nd(server);

  /* The filewatcher nodes */
  var filewatchers = [];

  function errorListener(error) {
    nd.dispatchError(error);
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
    switch (changeType) {
    case 'update':
      nd.dispatchUpdate(filePath, currentStat, previousStat);
      break;
    case 'create':
      nd.dispatchCreate(filePath, currentStat, previousStat);
      break;
    case 'delete':
      nd.dispatchDelete(filePath, previousStat);
      break;
    default:
      console.log('Unhandled changeType: ' + changeType);
      break;
    }

    for (var f in filewatchers) {
      var fw = filewatchers[f];

      if (fw.active)
        fw.cache.pull();
      else
        fw.cache.push();
    }
  };

  /*
   * Initial setup.
   */
  function init() {

    function createFileWatchers() {
      for (var f in config.filewatchers) {
        filewatchers.push(new FileWatcher(f, config.filewatchers[f],
                                          errorListener, watchingListener,
                                          changeListener));
      }
    };

    createFileWatchers();
  }

  /*
   * Cleanup close.
   */
  function close() {

    function closeFileWatchers() {
      console.log('\nShutting down filewatchers.');
      for (var i = 0; i < filewatchers.length; i++)
        filewatchers[i].close();
    };

    closeFileWatchers();
  }

  init();

  /* Close on exit */
  process.on('SIGINT', function() {
    close();
  });
};

module.exports = Shit;
