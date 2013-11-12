exports.values = {
  version: '0.0.1',
  server: {
    production: {
      real_time_server : {
        port: 8080,
        host: '127.0.0.1'
      }
    }
  },
  aikos: {
    context: {
      rootPermissions: true,
      daemon: true,
      stdout: '/var/log/aikos',
      stderr: '/var/log/aikos',
      pidfile: '/tmp/aikosd'
    },
    files: {
      '/home/chris/src/aikosd/Documentation': {
        active: false
      }
    }
  }
}
