var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
emoji          = require("node-emoji"),
app            = express();

mongoose.connect("mongodb://localhost/rest_blog_app");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
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
  Blog.create(req.body.blog, function(err, newBlog){
    if(err) {
      res.render("new")
    } else {
      res.redirect("/blogs")
    }
  });

});

app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show",{blog:foundBlog})
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running ", emoji.get("coffee"))
})
