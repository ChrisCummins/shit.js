exports.configure = function(app) {
  app.get('/', function(req, res) {
    res.render('index.html', {
      title: 'Aikos'
    });
  });
};
