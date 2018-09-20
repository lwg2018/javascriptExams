var express = require('express');
var session = require('express-session'); // 쿠키값을 그대로노출시키지않고 사용자를 id값으로 확인하여
                                          // 그에맞는데이터는 서버에저장시켜놓고 맞는 id값의 데이터를보내준다
var app = express();
var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var FileStore = require('session-file-store')(session); // 메모리대신 파일에 데이터를 저장하게해줌

app.use(session({ // 기본적으로 메모리에 저장해놓기때문에 껐다키면 데이터가삭제된다
                  // 실제로서비스할때는 데이터베이스로 해야함
  store: new FileStore(),  // 파일에 저장하게됨(sessions 디렉토리 생성)
  secret: '123%!%!#^#',
  resave: false,
  saveUninitialized: true
}));

var User = {
  id: "leewoongi",
  password: "123456789",
  name: "Mille"
}

app.get('/count', function(req, res){
    if(req.session.count){
      req.session.count++;
    } else{
      req.session.count = 1;
    }
    res.send('count: '+req.session.count);
});

app.get('/auth/login', function(req, res){
    var output = `
      <h1>Login</h1>
      <form action="/auth/login" method="post">
        <p>
          <input type="text" name="username" placeholder="username">
        </p>
        <p>
          <input type="password" name="password" placeholder="password">
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `;

    res.send(output);
});

app.post('/auth/login', function(req, res){
  var id = req.body.username;
  var pwd = req.body.password;

  if(User.id==id && User.password==pwd){
    req.session.displayname = User.name;
    res.redirect('/welcome');
  } else{
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
});

app.get('/welcome', function(req, res){
  if(req.session.displayname){
    console.log(req.session);
    res.send('welcome '+req.session.displayname+' <a href="/logout">logout</a>');
  } else{
      res.send('welcome <a href="/auth/login">login</a>');
  }
});

app.get('/logout', function(req, res){
    delete req.session.displayname;
    res.redirect('/welcome');
});

app.listen(3005, () => {
  console.log('Connected 3005 port!');
});
