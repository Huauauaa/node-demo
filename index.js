const express = require('express');
const app = express();
const User = require('./user.db');
const Product = require('./product.db');
const Name = require('./name.db');
const cors = require('cors');

app.use(cors());

const superagent = require('superagent');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('harvey api'));
app.get('/page', (req, res) => res.sendFile(`${__dirname}/index.html`));
app.get('/name-maker', (req, res) =>
  res.sendFile(`${__dirname}/build/index.html`),
);
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.end(JSON.stringify(users));
});
app.get('/api/user/:age', async (req, res) => {
  const { age } = req.params;
  const user = await User.findOne({ age: Number(age) });
  res.end(JSON.stringify(user));
});

app.get('/api/products', async (req, res) => {
  const items = await Product.find();
  res.end(JSON.stringify(items));
});

app.use(express.json());
app.post('/api/product', async (req, res) => {
  const p = new Product({ name: req.body.name });
  p.save(function () {
    res.end('success');
  });
});

app.get('/api/name', async (req, res) => {
  const { page = 1, size = 10, keyword } = req.query;
  const items = await Name.find().sort({ _id: 'desc' });
  res.send({
    items: items
      .filter((item) => item.name.includes(keyword))
      .slice((page - 1) * size, size * page),
    page: Number(page),
    size: Number(size),
    total: items.length,
  });
});

app.use(express.json());
app.post('/api/name', async (req, res) => {
  const { name, pinyin } = req.body;
  const names = await Name.find({ name }).exec();
  if (names.length !== 0) {
    res.status(400).send({ error: `${name} exists.` });
  } else {
    const p = new Name({ name, pinyin });
    p.save(function () {
      res.end('success');
    });
  }
});

app.post('/api/names', async (req, res) => {
  const names = req.body;
  Name.insertMany(names, function (err) {
    res.end(`success: ${names.length}`);
  });
});

app.delete('/api/name', async (req, res) => {
  const { _id } = req.query;
  await Name.deleteOne({ _id });
  res.end('success');
});

app.put('/api/name', async (req, res) => {
  const { _id, name, pinyin } = req.body;
  const payload = {};
  if (name) {
    payload.name = name;
  }
  if (pinyin) {
    payload.pinyin = pinyin;
  }
  await Name.updateOne({ _id }, payload);
  res.end('success');
});

const getResults = (res) => {
  let results = [];
  let $ = cheerio.load(res.text);

  $('div#header-detail ul li').each((index, element) => {
    const id = $(element).attr('id');
    if (id === 'tone_py') {
      results.push({
        name: $(element).find('.pronounce').attr('id'),
        label: $(element).find('label').text().replace(' ', ''),
        content: [$(element).find('b').text()],
      });
    } else {
      results.push({
        name: $(element).attr('id'),
        label: $(element).find('label').text().replace(' ', ''),
        content: [$(element).find('span').text()],
      });
    }
  });

  $('div[data-group="imeans"]').each((index, element) => {
    const name = $(element).find('.title.active').attr('id');
    const label = $(element).find('.title.active').text();
    const content = [];
    $(element)
      .find('.tab-content dl dd p')
      .each((i, e) => {
        content.push($(e).text());
      });
    results.push({
      name,
      label,
      content,
    });
  });

  return results;
};
let doms = [];
app.get('/api/word', async function (req, res) {
  const word = req.query.wd || '';
  const url = encodeURI(`https://hanyu.baidu.com/zici/s?wd=${word}`);

  const response = await superagent.get(url);
  res.send(getResults(response));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
