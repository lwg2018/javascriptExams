module.exports = function(app){
  // passport
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  app.use(passport.initialize());
  app.use(passport.session());
  
  var conn = require('./db')(); // 함수호출

  // password, salt
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();

  // 첫 로그인시 user인자를 사용하여 세션에 등록한다
  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
  });

  // 로그인 되어있는경우 세션의 id값(user.authId)을 이용하여 자동로그인시킨다
  // 세션이 null값이 아닌경우 항상 실행된다
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
        done('There is no user.');
      } else {
        done(null, results[0]);
      }
    });
  });

  passport.use(new LocalStrategy( // 사용자의 아이디 비밀번호 입력
    function(username, password, done){
      var uname = username;
      var pwd = password;

      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local:'+uname], function(err, results){
        if(err){
          return done('There is no user.');
        }

        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user); // serializeUser 실행
          } else {
            done(null, false);
          }
        });
      });
    }
  ));

  passport.use(new FacebookStrategy({ // 페이스북 타사인증(federation authentication)
    clientID: '276606446045584',      // 정보는 facebook developer
    clientSecret: 'bb53e7b8a02ce65328492587570e2d7c',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },

    function(accessToken, refreshToken, profile, done) { // profile - 사용자 정보
      console.log(profile);
      var authId = 'facebook:'+profile.id;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, [authId], function(err, results){
        if(results.length>0){
          done(null, results[0]);
        } else {
          var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
          };
          var sql = 'INSERT INTO users SET ?'
          conn.query(sql, newuser, function(err, results){
            if(err){
              console.log(err);
              done('Error');
            } else {
              done(null, newuser); // serializeUser 실행
            }
          })
        }
      });
    }
  ));

  return passport;
}
