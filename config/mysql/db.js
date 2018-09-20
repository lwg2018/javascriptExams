module.exports = function(){
  // mysql 연결
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456789',
    database : 'o2'
  });
  conn.connect();

  return conn;
}
