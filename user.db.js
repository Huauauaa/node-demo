const mongoose = require('mongoose');
const MONGO_URI =
  'mongodb+srv://huauauaa:hua123456@cluster0-k9zrs.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(process.env.MONGO_URI || MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const User = mongoose.model('User', { name: String, age: Number });

// const foo = new User({ name: 'foo', age: 11 });
// const bar = new User({ name: 'bar', age: 29 });
// foo.save().then(() => console.log('foo'));
// bar.save().then(() => console.log('bar'));
module.exports = User;
