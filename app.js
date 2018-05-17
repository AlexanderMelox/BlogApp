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

// Index route
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => err ? console.log(err) : res.render('index', {blogs}));
});

// New route
app.get('/blogs/new', (req, res) => res.render('new'));

// Create route
app.post('/blogs', (req, res) => {
  // Create blog,then, redirect to index
  Blog.create(req.body.blog , (err, newBlog) => err ? res.render('new') : res.redirect('/blogs'));
});

// Show route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => err ? res.redirect('/blogs') : res.render('show', {blog}));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

