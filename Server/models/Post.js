const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    excerpt: { type: String },
    tags: { type: [String] },
    category: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    readingTime: { type: Number },
    publishedDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
