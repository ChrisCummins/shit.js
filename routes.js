exports.configure = function(app) {
  app.get('/', function(req, res) {
    res.render('index.html', {
      title: 'shit.js'
    });
  });

  app.get('/theme.html', function(req, res) {
    res.render('theme.html', {
      title: 'shit.js Theme'
    });
  });
};
