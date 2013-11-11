var INIT_PID = 1;
var ROOT_UID = 0;

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

}

/*
 * Initialise process context.
 */
function init(config) {

  if (config.rootPermissions)
    exitIfNoRootPermissions();

  if (config.daemon)
    initDaemon(config);

}
module.exports.init = init;
