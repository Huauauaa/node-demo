const mongoose = require('mongoose');
const MONGO_URI =
  'mongodb+srv://huauauaa:hua123456@cluster0-k9zrs.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(process.env.MONGO_URI || MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const Product = mongoose.model('Product', { name: String, id: Number });

module.exports = Product;
