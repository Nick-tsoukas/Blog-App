var bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
express        = require("express"),
moment         = require("moment")
emoji          = require("node-emoji"),
app            = express();

mongoose.connect("mongodb://localhost/rest_blog_app");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: new Date(Date.now())}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res) {
  res.redirect("/blogs");
});
//Routes

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e4bfea6ec09ca199a163217d593c46d1&auto=format&fit=crop&w=2550&q=80",
//   body: "This is a Blog Post final"
// });

app.get("/blogs",function(req,res){
  Blog.find({},function(err, blogs) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {blogs : blogs});
    }
  });
});

//NEW route
app.get('/blogs/new', function(req,res) {
  res.render("new");
});


//Create route post request and then redirect
app.post("/blogs", function(req,res) {
  //create blogs
  console.log(req.body)
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log(req.body)
  Blog.create(req.body.blog, function(err, newBlog){
    if(err) {
      res.render("new")
    } else {
      res.redirect("/blogs")
    }
  });

});


// SHOW ROUTE
app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show",{blog:foundBlog})
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs")
    } else {
      res.render("edit", {blog : foundBlog})
    }
  });
})

// UPDATE Routes
app.put("/blogs/:id/", function(req, res) {
  // second parameter is equal to the value of name attribute in FORM === req.body.blog
  // findByIdAndUpdate method will update database !important

  //using sanitize module to remove scripts from the blog body
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id)
    }
  });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
  //destroy blog and redirect
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running ", emoji.get("coffee"))
})
