const express = require('express');
const app = express();
const User = require('./user.db');
const Product = require('./product.db');

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
app.get('/api/word', function (req, res) {
  const word = req.query.wd || '';
  const url = encodeURI(`https://hanyu.baidu.com/zici/s?wd=${word}`);

  superagent.get(url).end((err, res) => {
    if (err) {
      console.log(`获取百度字词失败 - ${err}`);
    } else {
      doms = getResults(res);
    }
  });
  console.log(doms);
  res.send(doms);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
