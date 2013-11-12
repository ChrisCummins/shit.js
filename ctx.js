/*
 * ctx.js - The daemon context. Provides the process management, assigning to
 *          init, creates the PID file, checks for root permissions etc.
 *
 * Available exports:
 *     logger              The daemon logger.
 *     getRootPermission() Check for root permissions.
 *     init()              Initialise daemon context (only call this once!).
 *
 * Usage:
 *     var ctx = require('./ctx');
 *
 * Config settings:
 *    context: {
 *      rootPermissions <bool>   Require root permissions.
 *      daemon          <bool>   Whether to fork and detach process context.
 *      stdout          <string> Path to standard output log file.
 *      stderr          <string> Path to standard error log file.
 *      pidfile         <string> Path to PID file.
 *    }
 */

/* Global imports */
var fs = require('fs');
var daemon = require('daemon');
var winston = require('winston');

/* Local imports */
var config = require('./config').aikos.context;

var INIT_PID = 1;
var ROOT_UID = 0;

/*
 * The daemon logger. Logs to the filename specified in the config. If not
 * given, default to '/var/log/aikosd'.
 */
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({
        filename: config.stdout || '/var/log/aikosd'
      })
    ]
  });
module.exports.logger = logger;

/*
 * Checks whether process has root permissions or not.
 *
 * @return boolean true if root permissions, else false.
 */
function getRootPermission() {
  return process.getuid() === ROOT_UID;
}
module.exports.getRootPermission = getRootPermission;

/*
 * Checks whether we have root permissions, else fails noisily.
 */
function exitIfNoRootPermissions() {
  if (!getRootPermission()) {
    console.log('fatal: must be ran as root!');
    process.exit(3);
  }
}

/*
 * Initialise daemon context.
 */
function initDaemon(config) {

  try {

    /* Set the change root of the process. */
    process.chdir('/');

    /* Set the file creation mask (umask) of the process. */
    process.umask(0);

    /* Daemon-ify the process */
    daemon();

  } catch(error) {
    console.log(error);
    console.log('fatal: failed to create daemon context!');
    process.exit(2);
  }

}

/*
 * Initialise the exception logger. Logs to the filename specified in the
 * config. If not given, default to '/var/log/aikosd.error'.
 */
function initErrorLog() {
  /* Setup the daemon exception logger */
  winston.handleExceptions(new winston.transports.File({
    filename: config.stderr || '/var/log/aikosd.error'
  }));
}

/*
 * Create a Process ID file. The PID file is deleted on program exit.
 */
function createPidFile(path) {
  var pid = process.pid + '\n';

  fs.writeFile(path, pid, function(error) {
    if (error)
      console.log('fatal: unable to write PID file \'' + path + '\'!');
  });

  process.on('SIGINT', function() {
    fs.unlink(path, function(error) {
      if (error)
        console.log('fatal: unable to remove PID file \'' + path + '\'!');
    });
  });
}

/*
 * Initialise process context.
 */
function init(config) {

  /* Root permissions check */
  if (config.rootPermissions)
    exitIfNoRootPermissions();

  /* Daemon context check */
  if (config.daemon)
    initDaemon(config);

  /* Setup our PID file. This must be done after the daemon context init as our
   * PID will change in the fork process. */
  createPidFile(config.pidfile || '/tmp/aikosd.pid');

  /* Set process name */
  process.title = 'aikosd'

  /* Setup the error logger */
  initErrorLog();
}
module.exports.init = init;
