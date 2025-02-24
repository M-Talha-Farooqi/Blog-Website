const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//! It will Create a post
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.userId,
    });

    const savedPost = await post.save();
    await savedPost.populate("author", "username");
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
