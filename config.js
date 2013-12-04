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
  context: {
    rootPermissions: true,
    daemon: false,
    stdout: '/var/log/shitd',
    stderr: '/var/log/shitd.error',
    pidfile: '/tmp/shitd/pid'
  },
  authentication: {
    user: 'chris',
    pass: 'test'
  },
  shit: {
    filewatchers: {
      '/home/chris/src/shit.js/': {
        active: false
      },
      '/etc/apache2/': {
        active: true
      },
      '/var/www/': {
        active: true
      }
    },
    cache: '/tmp/shitd/cache/'
  }
}
