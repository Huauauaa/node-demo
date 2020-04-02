const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

// DB Config
const db = require('./config/keys').MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('mongodb connected...'))
  .catch(err => console.error(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser ???
app.use(express.urlencoded({ extended: false }));

// Routers
app.use('/', require('./routers'));
app.use('/users', require('./routers/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
