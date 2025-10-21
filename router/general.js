const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({
      message: "Unable to register user. Please provide username and password.",
    });
});

// Task 1 & 10: Get the book list available in the shop (Using async-await)
public_users.get("/", async (req, res) => {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const allBooks = await getBooks;
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list." });
  }
});

// Task 2 & 11: Get book details based on ISBN (Using Promises)
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const getBookByIsbn = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });

  getBookByIsbn
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error.message }));
});

// Task 3 & 12: Get book details based on author (Using async-await)
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = [];
      for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push(books[key]);
        }
      }
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found by this author"));
      }
    });

    const authorBooks = await getBooksByAuthor;
    return res.status(200).json(authorBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4 & 13: Get all books based on title (Using async-await)
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const matchingBooks = [];
      for (const key in books) {
        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
          matchingBooks.push(books[key]);
        }
      }
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found with this title"));
      }
    });

    const titleBooks = await getBooksByTitle;
    return res.status(200).json(titleBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 5: Get book reviews
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
