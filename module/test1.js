module.exports = function(cal, a, b){
  var express = require('express');
  var route = express.Router();

  route.get('/sum', function(req, res){
    res.send(`sum ${cal.sum(a,b)}`);
  });

  route.get('/div', function(req, res){
    res.send(`div ${cal.sum(a,b)}`);
  })

  route.get('/', function(req, res){
    res.send('Hello');
  })

  return route;
}
