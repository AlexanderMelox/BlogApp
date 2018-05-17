const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// App config
mongoose.connect('mongodb://localhost/blogApp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// Moongoose/Model congig
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  // If no specified date is given, the default will be Date.now
  created: {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => err ? console.log(err) : res.render('index', {blogs}));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

