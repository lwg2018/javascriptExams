var express = require('express');
var session = require('express-session'); // 쿠키값을 그대로노출시키지않고 사용자를 id값으로 확인하여
                                          // 그에맞는데이터는 서버에저장시켜놓고 맞는 id값의 데이터를보내준다
var app = express();
var body_parser = require('body-parser');
//var mp5 = require('mp5'); 보안상의 이유로 이제는 사용하지않는다
//var sha256 = require('sha256');  더욱 어렵게 암호화하고싶다면 sha512, 둘다 단방향해쉬(암호화가능 복호화불가능.)
app.use(body_parser.urlencoded({ extended: false}));
var bkfd2Password = require("pbkdf2-password"); // salt값을 만들어준다
var hasher = bkfd2Password(); // 해시값

var MySQLStore = require('express-mysql-session')(session); // 메모리대신 mysql사용
app.use(session({ // 기본적으로 메모리에 저장해놓기때문에 껐다키면 데이터가삭제된다
                  // 실제로서비스할때는 데이터베이스로 해야함
                  // desc tables; 데이터의 속성들을 보여준다
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456789',
    database: 'o2'
  }),
  secret: '123%!%!#^#',
  resave: false,
  saveUninitialized: true
}));

var User =
  {
  id: "leewoongi",
  password: "iu/CmlXf/DufXfzw0+5B8hA+EIeEn8mOURdNrt/fbJvTBc1LvzjU7ia3oqJR2PYTBiOoaj0hGKRoPWqQz2oHg9ih/hDXUS0VWu2j/YO72UlHsUGk9t+NcKqOK/ulld4qQBdtPMensYnev8iTH+ETC5LP9c7rfVnMaKrcrTK3EWw=", // 123456789 + salt
  salt: "pboUiFgld1stYDohY4YDsuFCUPAg6MbmgcOGINHcyR09QFMJ9brjy8o4nVvEfUTb9fp5emkJGszS8mLWx3UPzw==", // 암호화를 더 복잡하게 하기 위한 변수
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

  if(User.id===id){
    return hasher({password:pwd, salt:User.salt}, function(err, pass, salt, hash){
      if(hash === User.password){
        req.session.displayname = User.name;
        req.session.save(function(){
          res.redirect('/welcome');
        });
    } else{
        res.send('Who are you? <a href="/auth/login">login</a>');
      }
    });
  }
});

app.get('/welcome', function(req, res){
  if(req.session.displayname){
    res.send('welcome '+req.session.displayname+' <a href="/logout">logout</a>');
  } else{
      res.send('welcome <a href="/auth/login">login</a>');
  }
});

app.get('/logout', function(req, res){
    delete req.session.displayname;
    req.session.save(function(){
      res.redirect('/welcome'); // 파일이나 메모리는상관없지만 데이터베이스의경우
                                // 안전하게 데이터가 저장된뒤에 리다이렉트를 해야함
    });
});

app.listen(3005, () => {
  console.log('Connected 3005 port!');
});
