// ALTER TABLE name ADD name2 type(num)

var express = require('express');
var app = express();

// session 사용
var session = require('express-session');

// session을 mysql에 저장
var MySQLStore = require('express-mysql-session')(session);

// post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// jade 사용
app.set('views', './views/mysql');
app.set('view engine', 'jade');

// session 등록. 저장소는 mysql
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host:'localhost',
    port:3306,
    user:'root',
    password:'123456789',
    database:'o2'
  })
}));

// passport 분할
var passport = require('./config/mysql/passport')(app);

app.get('/welcome', function(req, res){
  console.log('welcome: '+req.user);
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

// route 분할(auth/)
var auth = require('./route/mysql/auth')(passport);
app.use('/auth/', auth);

app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
