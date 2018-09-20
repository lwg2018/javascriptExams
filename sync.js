const fs = require('fs');

var data = fs.readFileSync('data.txt', {encoding:'utf8'}); // 동기
console.log(data);

fs.readFile('data.txt', {encording:'utf8'}, function(err, data){ // 비동기(따로처리)
  console.log(1);
  if(err) throw err;
  console.log(data);
});

console.log(2);
