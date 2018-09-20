var express = require('express');
var app = express();
var body_parser = require('body-parser'); // post방식은 익스프레스가 지원을안하므로 설치해야함
var fs = require('fs');

app.set('views', './views_file');
app.set('view engine', 'jade');

app.use(body_parser.urlencoded({ extended: false}));
app.locals.pretty = true; // 예쁘게

app.get('/topic/new', (req, res) => {
  fs.readdir('data', (err, files) => { // 디렉터리를 읽어온다
    if(err){
      console.log(err);
    }
    res.render('new', {topics: files});
  })
})

app.post('/topic', (req, res) => {
  var title = req.body.title;
  var description = req.body.description;

  fs.writeFile('data/'+title, description, function(err){ // writeFile : 파일을 쓴다(만든다)
    if(err){
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic'); // 사용자를 redirect 경로로 보낸다
  })
})

app.get(['/topic', '/topic/:id'], (req, res) => { // 경로를 배열로지정(여러개 설정가능)
  fs.readdir('data', (err, files) => { // readdir : 디렉토리의 파일들을 가져온다
    if(err){
      console.log(err);
    }
    var id = req.params.id;

    if(id){
      fs.readFile('data/'+id, 'utf8', (err, data) => { // readFile : 파일의 내용을 가져온다
        if(err){
          console.log(err);
        }
        res.render('view', {topics: files, title: id, description: data})
      })
    } else{
        res.render('view', {topics:files, title: 'Welcome', description: 'Hello'});
    }
  })
})

// app.get('/topic/:id', (req, res) => {
//   var id = req.params.id;
//
//   fs.readdir('data', (err, files) => { // readdir : 디렉토리의 파일들을 가져온다
//     if(err){
//       console.log(err);
//     }
//     fs.readFile('data/'+id, 'utf8', (err, data) => { // readFile : 파일의 내용을 가져온다
//       if(err){
//         console.log(err);
//       }
//       res.render('view', {topics: files, title: id, description: data})
//     })
//   })
// })

app.listen(3000, () => {
  console.log('Connected 3000 port!');
})
