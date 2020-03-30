const express = require('express');
const app = express();
const User = require('./user.db');

const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => res.send('harvey api'));
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.end(JSON.stringify(users))
});
app.get('/api/user/:age', async (req, res) => {
  const { age } = req.params;
  const user = await User.findOne({ age: Number(age) });
  console.log(user)
  res.end(JSON.stringify(user))
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
