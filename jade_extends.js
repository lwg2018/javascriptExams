var express = require('express');
var app = express();

app.set('views', './jade');
app.set('view engine', 'jade');

app.get('/view', function(req, res){
  res.render('view');
});

app.get('/add', function(req, res){
  res.render('add');
});

app.listen(3000, () => {
  console.log('Connected 3000 port!');
})
