/**
 *  for react-demo
 */
const express = require('express');
const users = require('./public/data/users.json');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 8000;

// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
//   );
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//   res.header('X-Powered-By', ' 3.2.1');
//   if (req.method == 'OPTIONS') res.send(200);
//   /*让options请求快速返回*/ else next();
// });
app.get('/api/users', (req, res) => {
  res.set({
    'Content-Type': 'application/binary-json',
    'Content-Length': '123',
    ETag: '12345',
  });
  res.send(JSON.stringify(users));
});
app.post('/api/user', (req, res) => {
  console.log(req);
  res.send(JSON.stringify(req.body));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
