const express = require('express');
const app = express();
const User = require('./user.db');
const Product = require('./product.db');

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('harvey api'));
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
