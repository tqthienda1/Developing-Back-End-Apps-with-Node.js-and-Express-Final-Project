const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  username = req.body.username;
  password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .send("Missing username or password or the username is invalid");
  }

  let duplicateUsername = users.filter((user) => {
    return user.username === username;
  });

  if (duplicateUsername.length > 0) {
    return res.status(400).send("Username already exists!");
  }

  users.push({ username: username, password: password });
  return res.status(200).send("User register successfully!");
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const allBooks = await books;
  return res.status(200).send(JSON.stringify(allBooks, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  isbnIndex = parseInt(req.params.isbn);
  selectedBook = await books[isbnIndex];
  if (selectedBook) {
    return res.status(200).send(JSON.stringify(selectedBook, null, 4));
  }

  return res.status(404).send("ISBN not found");
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  let filteredBooks = {};
  for (let key in await books) {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  }

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
  return res.status(404).send("Doesn't have books by " + author);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  let filteredBooks = {};
  for (let key in await books) {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  }

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
  return res.status(404).send("Doesn't have books with " + author + " title");
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  isbnIndex = parseInt(req.params.isbn);
  selectedBook = books[isbnIndex];

  if (selectedBook) {
    return res.status(200).send(JSON.stringify(selectedBook, null, 4));
  }

  return res.status(404).send("ISBN not found");
});

module.exports.general = public_users;
