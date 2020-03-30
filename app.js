const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Routers
app.use('/', require('./routers'));
app.use('/users', require('./routers/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
