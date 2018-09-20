var express = require('express');
var app = express();

app.get('/count', function(req,res){
  res.send('count: ');
});

app.listen(3000, () => {
  console.log('Connected 3000 port!');
});
