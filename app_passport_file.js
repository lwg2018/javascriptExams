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

//
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
app.use(passport.session());
//

var User = [
  {
  id: "leewoongi",
  password: "123456789",
  name: "Mille"
  }
];

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
      <a href="/auth/facebook">facebook</a>
    `;

    res.send(output);
});

passport.serializeUser(function(user, done) { // 등록되어있는 사용자가 새로 로그인하였을경우 세션에등록
  console.log('serializeUser: ', user);
  done(null, user.id); // 두번째 인자가 세션에 저장
}); // req.user => 패스포트가 새로운 객체를만듬

passport.deserializeUser(function(id, done) { // 세션에 등록되어있을경우 바로 로그인, id==user.username
  for(var i=0; i<User.length; i++){
    var user = User[i];
    console.log(user.id, id);
    if(user.id === id){
      return done(null, user);
    }
  }
  done('There is no user.');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var id = username;
    var pwd = password;

    for(var i=0; i<User.length; i++){
    var user = User[i];
    if(id === user.id) {
        if(pwd === user.password){
          console.log('LocalStrategy', user);
          done(null, user);
        } else {
          done(null, false);
        }
    }
  }
  done(null, false);
  }
  //
  //    if(User.id==id && User.password==pwd){
  //      console.log(username, password);
  //      done(null ,User);
  //      //res.redirect('/welcome');
  //    } else{
  //      done(null, false);
  //     //  res.send('Who are you? <a href="/auth/login">login</a>');
  //    }
  // }
)); // 로컬방식

passport.use(new FacebookStrategy({  // facebook developer에서 앱을 추가시켜야함
    clientID: '276606446045584',
    clientSecret: 'bb53e7b8a02ce65328492587570e2d7c',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
     var id = 'facebook:'+profile.id;
     for(var i=0; i<User.length; i++){
       var user = User[i];
       if(user.id === id){
         return done(null, user);
       }
     }
     var newuser = {
       'id':id,
       'displayName':profile.displayName,
       'email':profile.emails[0].value
     };
     User.push(newuser);
     done(null, newuser);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
)); // 페이스북 방식

app.post('/auth/login', passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false }));
// app.post('/auth/login', function(req, res){
//   var id = req.body.username;
//   var pwd = req.body.password;
//
//   if(User.id==id && User.password==pwd){
//     req.session.displayname = User.name;
//     res.redirect('/welcome');
//   } else{
//     res.send('Who are you? <a href="/auth/login">login</a>');
//   }
// });

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/welcome',
                                      failureRedirect: '/auth/login' })); // 로그인

app.get('/welcome', function(req, res){
  if(req.user){
    res.send('welcome '+req.user.id+' <a href="/logout">logout</a>');
  } else{
    res.send('welcome <a href="/auth/login">login</a> <li><a href="/auth/register">Register</a></li>');
  }
});

app.get('/logout', function(req, res){
    req.logout(); // delete req.session.displayname;
    req.session.save(function(){
  res.redirect('/welcome');
});
});

app.post('/auth/register', function(req, res){ // 사용자 등록
     var user = {
       id:req.body.username,
       password:req.body.password,
       displayName:req.body.displayName
     };
     User.push(user);
     req.login(user, function(err){
       req.session.save(function(){
         res.redirect('/welcome');
       });
     });
 });

 app.get('/auth/register', function(req, res){
   var output = `
   <h1>Register</h1>
   <form action="/auth/register" method="post">
     <p>
       <input type="text" name="username" placeholder="username">
     </p>
     <p>
       <input type="password" name="password" placeholder="password">
     </p>
     <p>
       <input type="text" name="displayName" placeholder="displayName">
     </p>
     <p>
       <input type="submit">
     </p>
   </form>
   `;
   res.send(output);
 });


app.listen(3005, () => {
  console.log('Connected 3005 port!');
});
