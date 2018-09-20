// npm install --save node-mysql
// npm install --save mysql

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',  // 자신의 컴퓨터
  user     : 'root',       //
  password : '123456789',
  database : 'o2'          // 사용할 데이터베이스
});

connection.connect(); // 연결

var shows = 'SELECT * FROM topic';  // sql 구문을 인자로 전달
var updates = 'UPDATE topic SET title=?, description=?, author=? where id=?';
var deletes = 'DELETE FROM topic where id=?';
var inserts = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';

/*
var param = ["test", "testing...", "LEE"]; // ? 부분에 차례대로 들어간다
connection.query(inserts, param, function(err, rows, fields){ // 에러, 행, 열
  if(err){
    console.log(err);
  } else{
    console.log(rows);
  }
});
*/

/*
var param2 = ["test_update", "updating...", "lee", 3];
connection.query(updates, param2, function(err, rows, fields){ // query : 요청
  if(err){
    console.log(err);
  } else{
    console.log(rows);
  }
});
*/

/*
var param3 = [3];
connection.query(deletes, param3, function(err, rows, fields){
  if(err){
    console.log(err);
  } else{
    console.log(rows);
  }
});
*/

connection.query(shows, function(err, rows, fields){
  if(err){
    console.log(err);
  } else{
    for(var i=0; i<rows.length; i++){
            console.log(rows[i].title);
    }
  }
});

connection.end();
