module.exports = {
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
      stdout: '/var/log/aikosd',
      stderr: '/var/log/aikosd.error',
      pidfile: '/tmp/aikosd.pid'
    },
    files: {
      '/home/chris/src/aikosd/': {
        active: false
      }
    }
  }
}
