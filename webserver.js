const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

http.createServer((req, res) => { // 요청(=req) , 응답(=res)
  res.writeHead(200, { 'Content-Type': 'text/plain' }); // 응답
  res.end('Hello World\n');
}).listen(port, hostname, () => { // port지정, hostname지정
  console.log(`Server running at http://${hostname}:${port}/`);
});
