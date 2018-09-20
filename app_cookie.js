var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser('asgasdg')); // 암호를 인자로 준다(key)

var products = {
  1:{title:'test1'},
  2:{title:'test2'},
  3:{title:'test3'},
  4:{title:'test4'},
  7:{title:'test7'}
};



app.get('/count', function(req,res){
  if(req.signedCookies.count){ // cookie값을 요청함, 암호화시킨다
    var count = parseInt(req.signedCookies.count);
  } else{
    var count = 0;
  }

  count += 1;
  res.cookie('count', count, {signed: true});
  res.send('count: '+count);
});

app.get('/products', function(req,res){
    var output = '';
    for(var name in products){
      output += `<li><a href="/cart/${name}">${products[name].title}</a></li>`;
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart', function(req, res){
    var cart = req.cookies.cart;

    if(!cart){
      res.send('Empty!');
    } else{
      var output = '';
      for(var id in cart){
        if(cart[id]!=0){
          output += `<li>${products[id].title} (${cart[id]}) <a href="/cart/${id}/delete">delete</a></li>`;
        }
      }
    }

    res.send(`<ul>${output}</ul><a href="/products">Products List</a>`);
});

app.get('/cart/:id/delete', function(req, res){
  var cart = req.cookies.cart;
  var id = req.params.id;

  cart[id]=0;

  res.cookie('cart', cart);
  res.redirect('/cart');
});

app.get('/cart/:id', function(req, res){
    var id = req.params.id;
    if(req.cookies.cart){
      var cart = req.cookies.cart;
    } else{
      var cart = {};
    }

    if(!cart[id]){
      cart[id]=0;
    }
    cart[id]=parseInt(cart[id])+1;

    res.cookie('cart', cart);
    res.redirect('/cart');
});

app.listen(3000, () => {
  console.log('Connected 3000 port!');
});
