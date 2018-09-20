var express = require('express');
var app = express();
var cal = require('./module/cal.js');
var sum = require('./module/sum');
var test1 = require('./module/test1');

app.use('/test1', test1(cal));
app.use('/test3', test1(cal, 20, 5));

app.get('/test2', function(req,res){
  res.send(`${sum(20,50)}`);
  console.log(test1);
});

app.listen(3000, () => {
  console.log('Connected 3000 port!');
});
