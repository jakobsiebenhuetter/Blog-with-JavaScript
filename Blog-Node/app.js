const path = require("path");

const express = require("express");
const uuid = require("uuid");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const blogCommentData = require("./util/blogs_comments_data");

const app = express();
// Relevanter code für ejs:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//
app.use(express.urlencoded({ extended: false }));
app.use(express.static("styles"));
app.use(express.static("images"));

// Für Blogs
app.get("/createNewBlog", (request, response) => {
  response.render("createNewBlog");
});

app.get("/this-blog", (request, response) => {
  response.render("this-blog");
});

app.post("/blog", (request, response) => {
  const blog = request.body;
  blog.id = uuid.v4();
  const storedBlogs = blogCommentData.blogDataFromJsonFile();
  storedBlogs.push(blog);
  blogCommentData.writeBlogDataIntoJson(storedBlogs);

  response.redirect("/index");
});

app.get("/blog/:id", (request, response) => {
  const blogId = request.params.id;
  const blogData = blogCommentData.blogDataFromJsonFile();

  for (const blog of blogData) {
    if (blog.id === blogId) {
      return response.render("blog", { myBlog: blog });
    }
  }
  //Blog nicht gefunden, falsche URL eingegeben?
  response.status(404).render("404");
});

// Mit Passwort zum verändern der Blogs
app.post("/edit/:id", (request, response) => {
  const blogId = request.params.id;
  const updatedText = request.body.updatedText;
  const password = request.body.password;
  const button = request.body.button;

  if (password === process.env.PASSWORD) {
    const blogData = blogCommentData.blogDataFromJsonFile();

    if (button === "edit") {
      for (const blogIndex of blogData) {
        if (blogId === blogIndex.id) {
          blogIndex.blog = updatedText;
          blogCommentData.writeBlogDataIntoJson(blogData);
        }
      }
    } else if (button === "delete") {
      for (let i = 0; i < blogData.length; i++) {
        if (blogData[i].id === blogId) {
          blogData.splice(i, 1);
          blogCommentData.writeBlogDataIntoJson(blogData);
        }
      }
    }

    response.redirect("/index");
  } else {
    response.status(401).send("Ungültiges Passwort");
  }
});

// get Routes für Blogs und Kommentare
app.get("/index", function (request, response) {
  const storedBlogs = blogCommentData.blogDataFromJsonFile();

  const storedComments = blogCommentData.commentsDataFromJsonFile();

  response.render("index", { blogs: storedBlogs, comments: storedComments });
});

app.get("/", (request, response) => {
  const storedBlogs = blogCommentData.blogDataFromJsonFile();
  const storedComments = blogCommentData.commentsDataFromJsonFile();

  response.render("index", { blogs: storedBlogs, comments: storedComments });
});

// Für Kommentare
app.post("/addcomment", (request, response) => {
  const comment = request.body;
  comment.id = uuid.v4();
  const storedComments = blogCommentData.commentsDataFromJsonFile();
  storedComments.push(comment);
  blogCommentData.writeCommentsDataIntoJson(storedComments);

  response.redirect("/index");
});

app.post("/edited-comment", (request, response) => {
  const hiddenCommentId = request.body.commentid;
  const editedComment = request.body.editedComment;
  const storedComments = blogCommentData.commentsDataFromJsonFile();

  for (const comment of storedComments) {
    if (comment.id === hiddenCommentId) {
      comment.comment = editedComment;
      blogCommentData.writeCommentsDataIntoJson(storedComments);
    }
  }
  return response.redirect("/index");
});

app.post("/delete/:id", function (request, response) {
  const commentId = request.params.id;
  const storedComments = blogCommentData.commentsDataFromJsonFile();
  const updateComments = storedComments.filter(
    (comment) => comment.id !== commentId
  );
  blogCommentData.writeCommentsDataIntoJson(updateComments);

  response.redirect("/index");
});

// Middleware für Probleme
// Client hat einen Fehler gemacht
app.use((request, response) => {
  response.status(404).render("404");
});

// Wenn der Server Probleme macht
app.use((error, request, response, next) => {
  response.status(500).render("500");
});

app.listen(3000);
