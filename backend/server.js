const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "demo_secret";
let users = [];
let posts = [];
let uid = 1, pid = 1;

// Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const user = { id: uid++, username, password };
  users.push(user);
  res.json({ message: "User registered" });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username }, SECRET);
  res.json({ token });
});

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// Create Post
app.post("/posts", auth, (req, res) => {
  const post = { id: pid++, userId: req.user.id, text: req.body.text };
  posts.push(post);
  res.json(post);
});

// Get Posts
app.get("/posts", (req, res) => res.json(posts));

app.listen(5000, () => console.log("API running on 5000"));
