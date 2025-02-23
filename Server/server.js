const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const Post = require("./models/Post"); // Import the Post model

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Other middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log("--------------------");
  console.log("Request:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });

  // Capture the response
  const originalSend = res.send;
  res.send = function (data) {
    console.log("Response:", {
      statusCode: res.statusCode,
      data: data,
      headers: res.getHeaders(), // Log the response headers
    });
    return originalSend.call(this, data);
  };

  next();
});

// Handle preflight requests
app.options("*", cors()); // Enable pre-flight across-the-board

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/social_app")
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Database:", mongoose.connection.db.databaseName);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE endpoint to delete a post by ID
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Post.deleteOne({ _id: id }); // Assuming Mongoose is used
    if (result.deletedCount === 0) {
      return res.status(404).send("Post not found");
    }
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});

// PUT endpoint to update a post by ID
app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // Get the updated data from the request body
  try {
    const result = await Post.findByIdAndUpdate(id, updatedData, { new: true });
    if (!result) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(result); // Return the updated post
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
});

// Fetch all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server error");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Function to start server
const startServer = (port) => {
  try {
    app
      .listen(port, () => {
        console.log(`Server running on port ${port}`);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`Port ${port} is busy, trying ${port + 1}`);
          startServer(port + 1);
        } else {
          console.error("Server error:", err);
        }
      });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
startServer(PORT);
