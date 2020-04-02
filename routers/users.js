const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { username: req.body.username });
});

router.post('/login', (req, res) => {
  // res.send(JSON.stringify(req.body));
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('login', {
      username,
      password,
    });
  } else {
    res.render('dashboard', { username: req.body.username });
  }
});

router.post('/register', (req, res) => {
  // res.send(JSON.stringify(req.body));
  const { username, password, password1 } = req.body;
  const errors = [];
  if (!username || !password || !password1) {
    errors.push('please input all fields');
  }
  if (password !== password1) {
    errors.push('password should be same');
  }
  if (errors.length === 0) {
    res.render('login');
  } else {
    res.render('register', {
      username,
      password,
      password1
    });
  }
});

module.exports = router;
