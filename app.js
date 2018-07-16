const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

// Init app
const app = express();
// Port where server listens too
const port = 3000;

// App config
mongoose.connect('mongodb://localhost/blogApp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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

  // sanitize the body text so users cannot use html <script> tags
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.create(req.body.blog , (err, newBlog) => err ? res.render('new') : res.redirect('/blogs'));
});

// Show route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => err ? res.redirect('/blogs') : res.render('show', {blog}));
});

// Edit route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});

// Update route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

