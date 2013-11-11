exports.values = {
  version: '0.0.1',
  server: {
    production: {
      real_time_server : { port: 8080, host: '127.0.0.1' }
    }
  },
  aikos: {
    files: {
      '/home/chris/src/aikosd': {
        active: true
      },
      '/home/chris/src/aikosd/Documentation': {
        active: false
      }
    }
  }
}
