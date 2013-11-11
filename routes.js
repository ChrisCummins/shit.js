exports.configure = function(app) {
  app.get('/', function(req, res) {
    res.render('index.html', {
      title: 'Aikos'
    });
  });

  app.get('/theme.html', function(req, res) {
    res.render('theme.html', {
      title: 'Aikos Theme'
    });
  });
};
