// npm install supervisor -g 를 사용하면 재시작할필요없이 워처기능 사용한다

const express_test = require('express');
var app = express_test();
var body_parser = require('body-parser'); // post방식은 익스프레스가 지원을안하므로 설치해야함

app.use(body_parser.urlencoded({ extended: false}));
app.locals.pretty = true; // 예쁘게

app.set('view engine', 'jade'); // jade 템플릿엔진을 연결한다
app.set('views', './views'); // 쓰지않아도 views 디렉토리로 기본값이되어있음
app.use(express_test.static('public')); // 정적파일을 public 디렉토리에서 불러올수있다.
                                        // ex) localhost:2000/test.jpg

app.get('/template', function(req, res){
    res.render('temp', {time:Date()}); // 객체에 값을 전달해준다(time에 현재시간 전달)
}); // render함수로 템플릿

app.get('/', function(req, res){
    res.send('Hello home page');
});

app.get('/topic', function(req, res){
  var ss = [
    'JavaScript is...',
    'Nodejs is...',
    'Express is...'
  ];
  var as = `
  <a href="/topic?id=0">JavaScript</a></br>
  <a href="/topic?id=1">Nodejs</a></br>
  <a href="/topic?id=2">Express</a></br>
  ${ss[req.query.id]}
  `;  // 쿼리스트링을 사용

  res.send(as);
})

app.get('/form', function(req, res){ // form방식
  res.render('form');
})
app.get('/form_receiver', (req, res) => { // method = get방식
  var title = req.query.title;
  var description = req.query.description;

  res.send(title + ',' + description);
})

app.post('/form_receiver', (req, res) => { // method = post방식
  var title = req.body.title;              // post방식으로 전달된 데이터는 정의되어있지않다
  var description = req.body.description;  // 사용하려면 body-parser를 설치해야함(미들웨어)

  res.send(title + ',' + description);
}) // URL상에 데이터가 표시되지않아야할때(비밀번호 등) 사용한다

app.get('/topic2/:id', function(req, res){ // 파라미터방식
  var ss = [
    'JavaScript is...',
    'Nodejs is...',
    'Express is...'
  ];
  var as = `
  <a href="/topic2/0">JavaScript</a></br>
  <a href="/topic2/1">Nodejs</a></br>
  <a href="/topic2/2">Express</a></br>
  ${ss[req.params.id]}
  `;  // 시멘틱 URL을 사용

  res.send(as);
})

app.get('/dynamic', (req, res) => {
  var list = '';
  for(var i=0; i<5; i++){
    list = list + '<li>cording</li>'
  }
  var time = Date(); // 자바스크립트가 가지고있는 api
  var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      Hello Dynamic!
      ${list}
      ${time}
    </body>
  </html>`;

  res.send(output);
})  // 동적인 코드작성은 내용이변경되었을경우 재시작 해야한다

app.get('/login', function(req, res){
    res.send('Hello login page');
});

app.listen(2000, function(){
  console.log('Connected 2000 port!');
})
