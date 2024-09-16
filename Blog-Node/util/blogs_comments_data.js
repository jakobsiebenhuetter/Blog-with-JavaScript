const path = require("path");
const fs = require("fs");

// Paths
const blogsfilePath = path.join(__dirname, "..", "blogs.json");
const commentsfilePath = path.join(__dirname, "..", "comments.json");

// Blogs
function getBlogsData() {
  const blogfileData = fs.readFileSync(blogsfilePath);

  return JSON.parse(blogfileData);
}

function writeBlogData(blogData) {
  fs.writeFileSync(blogsfilePath, JSON.stringify(blogData));
}

//Comments
function getCommentsData() {
  const fileData = fs.readFileSync(commentsfilePath);

  return JSON.parse(fileData);
}

function writeCommentsData(commentsData) {
  fs.writeFileSync(commentsfilePath, JSON.stringify(commentsData));
}

module.exports = {
  blogDataFromJsonFile: getBlogsData,
  writeBlogDataIntoJson: writeBlogData,

  commentsDataFromJsonFile: getCommentsData,
  writeCommentsDataIntoJson: writeCommentsData,
};
