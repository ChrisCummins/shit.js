exports.values = {
  version: '0.0.1',
  server: {
    production: {
      real_time_server : { port: 8080, host: '127.0.0.1' }
    }
  },
  aikos: {
    context: {
      rootPermissions: false,
      daemon: true,
      stdout: '/var/log/aikos',
      stderr: '/var/log/aikos'
    },
    files: {
      '/home/chris/src/aikosd/Documentation': {
        active: false
      }
    }
  }
}
