exports.getApp = function(config) {

  var express = require('express');
  var app = module.exports = express.createServer();

  return app;
};
